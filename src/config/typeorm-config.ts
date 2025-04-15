import { Address, Alarms, Coverage, WiotData, Device, GreyListItem, WhiteListItem, Meter } from '../common/entities/entitities';
import { DataSource, DataSourceOptions } from 'typeorm';


export const ormConfig: DataSourceOptions = {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Device, Coverage, WiotData, GreyListItem, WhiteListItem, Address, Alarms, Meter],
    synchronize: false,
    logging: false,
    extra: {
        connectionLimit: 100
    }
};

// Podrías exportar una instancia de DataSource directamente si prefieres
export const AppDataSource = new DataSource(ormConfig);
