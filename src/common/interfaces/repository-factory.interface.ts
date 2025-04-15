import { AddressRepository, CoverageRepository, WiotDataRepository, DeviceRepository, GreyListItemRepository, WhiteListItemRepository, AlarmsRepository, MeterRepository} from "../repositories/repositories";



export interface IRepositoryFactory {
    createAddressRepository(): AddressRepository;
    createDeviceRepository(): DeviceRepository;
    createWiotDataRepository(): WiotDataRepository;
    createWhiteListRepository(): WhiteListItemRepository;
    createGreyListRepository(): GreyListItemRepository;
    createCoverageRepository(): CoverageRepository;
    createAlarmsRepository(): AlarmsRepository;
    createMeterRepository(): MeterRepository;
}
