import { DataSource, Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { logger } from '../../config/winston-config';



export class AddressRepository {
    private readonly _repository: Repository<Address>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Address);
    }

    findAddressByImei(imei: string): Promise<Address> {
        return this._repository
            .createQueryBuilder('address')
            .innerJoin('address.device', 'device')
            .where('device.imei = :imei', { imei })
            .getOne();
    }

    createAddress(address: Address): Promise<Address> {
        return this._repository.save(address);
    }

    findAddress(address:Address): Promise<Address> {
        return this._repository.findOne({
            where: {
                primary: address.primary,
                secondary: address.secondary,
                fotaIp: address.fotaIp
            }
        });
    }

    async updateAddress(address: Address): Promise<Address> {
        const existingAddress = await this._repository.findOneBy({ id: address.id });
        if (!existingAddress) {
            logger.error("Address couldn't be updated since it doesn't exist:" + address.id);
        }
        const updatedAddress = this._repository.merge(existingAddress, address);

        return this._repository.save(updatedAddress);
    }
}
