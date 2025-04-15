import { DataSource, Repository } from 'typeorm';
import { Coverage } from '../entities/coverage.entity';

export class CoverageRepository {
    private _repository: Repository<Coverage>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Coverage);
    }

    createCoverage(coverage: Coverage): Promise<Coverage>{
        return this._repository.save(coverage);
    }
}
