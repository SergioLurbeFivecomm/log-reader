import { DataSource, Repository } from 'typeorm';
import { WiotData } from '../entities/wiot-data.entity';
import { Device } from '../entities/device.entity';


export class WiotDataRepository{
    private readonly _repository: Repository<WiotData>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(WiotData);
    }

    createWiotData(wiotData: WiotData): Promise<WiotData>{
        return this._repository.save(wiotData);
    }
}
