import { DataSource } from 'typeorm';
import { logger } from './winston-config';

export class SchemaValidator {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async validate(): Promise<void> {
        try {
            const tablesToValidate = ['DEVICE', 'COVERAGE', 'GREYLISTITEM', 'ALARMS', 'ADDRESS', 'METER', 'WIOT_DATA', 'WHITELISTITEM'];
            for (const table of tablesToValidate) {
                await this.compareTableWithEntity(table);
            }
        } catch (error) {
            logger.error('Error during schema validation: ' + error.message);
            process.exit(1);
        }
    }

    private async compareTableWithEntity(tableName: string): Promise<void> {
        const columnsInDatabase = await this.getDatabaseColumns(tableName);
        const columnsInEntity = this.getEntityColumns(tableName);

        const missingInDatabase = columnsInEntity.filter(col => !columnsInDatabase.includes(col));
        const extraInDatabase = columnsInDatabase.filter(col => !columnsInEntity.includes(col));

        if (missingInDatabase.length > 0 || extraInDatabase.length > 0) {
            logger.error(`Schema mismatch detected for table ${tableName}`);
            if (missingInDatabase.length > 0) {
                logger.error(`Columns in entity ${tableName} but missing in database: ${missingInDatabase.join(', ')}`);
            }
            if (extraInDatabase.length > 0) {
                logger.error(`Columns in database but missing in entity ${tableName}: ${extraInDatabase.join(', ')}`);
            }
            process.exit(1);
        } else {
            logger.info(`Table ${tableName} is in sync with the entity.`);
        }
    }

    private async getDatabaseColumns(tableName: string): Promise<string[]> {
        const queryResult = await this.dataSource.query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`
        );
        return queryResult.map((row: { COLUMN_NAME: string }) => row.COLUMN_NAME);
    }

    private getEntityColumns(tableName: string): string[] {
        const entityMetadata = this.dataSource.getMetadata(tableName);
        return entityMetadata.columns.map(column => column.databaseName);
    }
}
