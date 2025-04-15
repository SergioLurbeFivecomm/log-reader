import { Device } from '../entities/device.entity';
import { Exception } from '../exceptions/exception';
import { DeviceRepository } from '../repositories/device.repository';

export class DeviceCommonService {
    private deviceRepository: DeviceRepository

    constructor(deviceRepository: DeviceRepository){
        this.deviceRepository = deviceRepository;
    }

    async findDeviceByImei(imei: string): Promise<Device>{
        const device = await this.deviceRepository.findDeviceByImei(imei);
        if (!device){
            throw new Exception('Device not found', `Device not found for imei: ${imei} in Device Common Service handle message`);
        }
        return device;
    }
}