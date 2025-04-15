import { DeviceRepository, GreyListItemRepository, MeterRepository, WhiteListItemRepository } from "../../../common/repositories/repositories";
import { FrameService } from "../interfaces/frame-service";
import { RepositoryFactory } from "../../../common/factories/repository-factory";
import { GreyListFrame } from '../greylist.frame';
import { GreyListItem, Meter, Device, WhiteListItem } from '../../../common/entities/entitities';
import { logger } from "../../../config/winston-config";
import { DateUtils } from "../../../common/utils/date.utils";
import { MqttSenderService } from '../../mqtt/mqtt-sender.service';
import { DeviceCommonService } from '../../../common/services/device-common.service';
import { manufacturerMap } from '../../../common/maps/manufacturer.map';

export class GreyListFrameService implements FrameService {
    private timestamp: string;
    private deviceRepository: DeviceRepository;
    private greyListItemRepository: GreyListItemRepository;
    private meterRepository: MeterRepository;
    private whiteListItemRepository: WhiteListItemRepository;
    private deviceCommonService: DeviceCommonService;

    constructor(repositoryFactory: RepositoryFactory, timestamp: string) {
        this.timestamp = timestamp;
        this.greyListItemRepository = repositoryFactory.createGreyListRepository();
        this.deviceRepository = repositoryFactory.createDeviceRepository();
        this.whiteListItemRepository = repositoryFactory.createWhiteListRepository();
        this.meterRepository = repositoryFactory.createMeterRepository();
        this.deviceCommonService = new DeviceCommonService(this.deviceRepository);
    }

    public async handleMessage(greyListFrame: GreyListFrame): Promise<void> {
        try {
            const currentDate = this.timestamp;
            const imei = greyListFrame.getImei();
            const device = await this.deviceCommonService.findDeviceByImei(imei);

            const whitelist = await this.whiteListItemRepository.findWhiteListByImei(imei);

            const greyList = await this.constructGreyList(device, greyListFrame);
            const greyListToday = await this.greyListItemRepository.findAllByImeiDate(imei, currentDate);

            await this.synchronizeGreyLists(greyList, greyListToday);

            device.lastMessageSent = currentDate;
            await this.deviceRepository.updateDeviceByImei(device.imei, device);
        } catch (error) {
            logger.error(`Error handling message: ${error.message}`);
        }
    }

    private async constructGreyList(device: Device, greyListFrame: GreyListFrame): Promise<Partial<GreyListItem>[]> {
        const greyList = greyListFrame.getGreylist();
        const currentTime = this.timestamp;
        const greyListItems = greyList.map(sensorId => this.createGreyListItem(sensorId, device, currentTime));

        return Promise.all(greyListItems);
    }

    private async createGreyListItem(sensorId: string, device: Device, timestamp: string): Promise<Partial<GreyListItem>> {
        const meterId = sensorId.slice(0, -4);
        const meter = await this.getOrCreateMeter(meterId);
        const rssi = parseInt(sensorId.slice(-4, -2), 16) * -1;
        const numVeces = parseInt(sensorId.slice(-2), 16);

        return {
            device,
            meter,
            rssi,
            numVeces,
            timestamp,
        };
    }

    private async getOrCreateMeter(meterId: string): Promise<Meter> {
        let meter = await this.meterRepository.findMeterById(meterId);

        if (!meter) {
            meter = new Meter();
            meter.meter_id = meterId;
            meter.manufacturer = this.determineManufacturer(meterId);
            await this.meterRepository.createMeter(meter);
        }

        return meter;
    }

    private determineManufacturer(meterId: string): string {
        const meterPrefix = meterId.substring(0, 4).toUpperCase();
        return manufacturerMap[meterPrefix] || null;
    }

    private async synchronizeGreyLists(newGreyList: Partial<GreyListItem>[], existingGreyList: GreyListItem[]): Promise<void> {
        const existingGreyListMap = new Map(existingGreyList.map(item => [item.meter.meter_id, item]));
        const operations = newGreyList.map(item => {
            const existingItem = existingGreyListMap.get(item.meter.meter_id);

            if (existingItem) {
                return this.greyListItemRepository.updateGreyListItem(existingItem.id, item);
            } else {
                return this.greyListItemRepository.createGreyListItem(item);
            }
        });

        await Promise.all(operations);
    }


}
