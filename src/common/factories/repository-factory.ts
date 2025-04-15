import { DataSource } from 'typeorm';
import { IRepositoryFactory } from '../interfaces/interfaces';
import { AddressRepository, AlarmsRepository, CoverageRepository, WiotDataRepository, DeviceRepository, GreyListItemRepository, WhiteListItemRepository, MeterRepository } from '../repositories/repositories';


export class RepositoryFactory implements IRepositoryFactory {
    constructor(private dataSource: DataSource) {}

    createAddressRepository(): AddressRepository {
        return new AddressRepository(this.dataSource);
    }

    createDeviceRepository(): DeviceRepository {
        return new DeviceRepository(this.dataSource);
    }

    createWiotDataRepository(): WiotDataRepository {
        return new WiotDataRepository(this.dataSource);
    }

    createWhiteListRepository(): WhiteListItemRepository{
        return new WhiteListItemRepository(this.dataSource);
    }

    createGreyListRepository(): GreyListItemRepository{
        return new GreyListItemRepository(this.dataSource);
    }
    
    createCoverageRepository(): CoverageRepository{
        return new CoverageRepository(this.dataSource);
    }

    createAlarmsRepository(): AlarmsRepository {
        return new AlarmsRepository(this.dataSource);
    }

    createMeterRepository(): MeterRepository {
        return new MeterRepository(this.dataSource);
    }

}
