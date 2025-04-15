
import { DataSource, In, Repository, UpdateResult } from 'typeorm';
import { Meter } from '../entities/meter.entity';


export class MeterRepository {
    private readonly _repository: Repository<Meter>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Meter);
    }
    findMeterById(meter_id: string): Promise<Meter> {
        return this._repository.findOne({ where: { meter_id }});
    }

    updateMeterById(meter_id: string, updatedProperties: Partial<Meter>): Promise<UpdateResult> {
        return this._repository.update({ meter_id }, updatedProperties);
    }

    createMeter(meter: Partial<Meter>) {
        return this._repository.save(meter);
    }

}
