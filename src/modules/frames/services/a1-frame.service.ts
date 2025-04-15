import { A1Frame } from "../a1.frame";
import { A1Response } from "../interfaces/response/a1-response.interface";
import { DateUtils } from '../../../common/utils/date.utils';
import { FrameService } from "../interfaces/frame-service";
import { AddressRepository, DeviceRepository } from '../../../common/repositories/repositories';
import { RepositoryFactory } from '../../../common/factories/repository-factory';
import { Exception } from '../../../common/exceptions/exception';
import { Device, WhiteListItem } from '../../../common/entities/entitities';
import { DeviceCommonService } from '../../../common/services/device-common.service';

export class A1FrameService implements FrameService {
    private timestamp: string;
    private addressRepository: AddressRepository;
    private deviceRepository: DeviceRepository;
    private deviceCommonService: DeviceCommonService;

    constructor(repositoryFactory: RepositoryFactory, timestamp: string) {
        this.timestamp = timestamp
        this.addressRepository = repositoryFactory.createAddressRepository();
        this.deviceRepository = repositoryFactory.createDeviceRepository();
        this.deviceCommonService = new DeviceCommonService(this.deviceRepository)
    }

    async handleMessage(a1Frame: A1Frame): Promise<void> {
        const imei = a1Frame.getImei();
        const device = await this.deviceCommonService.findDeviceByImei(imei);
        await this.updateA1Properties(device, a1Frame);
        const address = await this.addressRepository.findAddressByImei(imei);
        if(!address) throw new Exception('Handle A1 exception', `address not found for imei: ${imei}`)
        const response : A1Response = {
            srvAddr: address.primary + "," + address.secondary,
            currentTime: DateUtils.getCurrentDateStringFormat()
        };
    }

    private async updateA1Properties(device: Device, a1Frame: A1Frame): Promise<void>{
        try{
            const deviceUpdated: Device = {
                ...device,
                timestamp: this.timestamp,
                imsi: a1Frame.getImsi(),
                hw: a1Frame.getHwVersion(),
                fw: a1Frame.getFwVersion(),
                apn: a1Frame.getApn(),
                
            }
            await this.deviceRepository.updateDeviceByImei(a1Frame.getImei(), deviceUpdated);
        }catch(error){
            throw new Exception('Update A1 properties exception', `${error.message}`)
        }
        
    }
}
