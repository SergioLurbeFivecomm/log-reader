import { DataSource, Repository } from 'typeorm';
import { WhiteListItem } from '../entities/white-list-item.entity';


export class WhiteListItemRepository {
    private readonly _repository: Repository<WhiteListItem>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(WhiteListItem);
    }

    //!TODO: En whitelist si el timestamp no es el de hoy no enviarla.
    findWhiteListByImei(imei: string): Promise<WhiteListItem[]> {
        return this._repository
            .createQueryBuilder('whitelist')
            .innerJoin('whitelist.device', 'device')
            .innerJoinAndSelect('whitelist.meter', 'meter')
            .where('device.imei = :imei', { imei })
            .andWhere('whitelist.is_active = :is_active', { is_active: 1 })
            .getMany();
    }
    
    createWhiteListByList(whiteList: WhiteListItem[]) {
        return this._repository.save(whiteList);
    }
}
