import { DataSource, Repository } from "typeorm";
import { Alarms } from "../entities/entitities";

export class AlarmsRepository {
    private _repository: Repository<Alarms>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Alarms);
    }

    createAlarms(alarm: Alarms): Promise<Alarms>{
        return this._repository.save(alarm);
    }

    findAlarmsByImei(imei: string): Promise<Alarms> {
        return this._repository
            .createQueryBuilder('alarm')
            .innerJoin('alarm.device', 'device')
            .where('device.imei = :imei', { imei })
            .getOne();
    }
    
}
