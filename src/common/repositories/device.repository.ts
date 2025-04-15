
import { DataSource, In, Repository, UpdateResult } from 'typeorm';
import { Device } from '../entities/device.entity';


export class DeviceRepository {
    private readonly _repository: Repository<Device>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Device);
    }
    findDeviceByImei(imei: string): Promise<Device> {
        return this._repository.findOne({ where: { imei }, order: { timestamp: 'DESC' } });
    }
    
    findDevicesByImeis(imeis: string[]): Promise<Device[]> {
        return this._repository.find({ where: { imei: In(imeis) } });
    }

    updateDeviceByImei(imei: string, updatedProperties: Partial<Device>): Promise<UpdateResult> {
        return this._repository.update({ imei }, updatedProperties);
    }
}
