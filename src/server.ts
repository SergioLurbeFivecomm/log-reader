import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './config/typeorm-config';
import { logger } from './config/winston-config';
import { RepositoryFactory } from './common/factories/repository-factory';
import { EnvironmentValidatorConfig } from './config/environment-validator.config';
import { SchemaValidator } from './config/schema-validator.config';
import { MessageProcessorService } from './modules/log-reader/message-processor.service';
import { LogReaderService } from './modules/log-reader/log-reader.service';

async function initializeApp() {
    try {
        new EnvironmentValidatorConfig();
        await AppDataSource.initialize();
        logger.info('Data Source has been initialized!');
        const repositoryFactory = new RepositoryFactory(AppDataSource);
        const messageProcessor = new MessageProcessorService(repositoryFactory);
        //const logFilePath = './data/dispositivo.log';
        const schemaValidator = new SchemaValidator(AppDataSource);
        await schemaValidator.validate();
        const logReaderService = new LogReaderService('./nb-pro-2025-04-14.log', messageProcessor);
        await logReaderService.readLogFile();


    } catch (error) {
        logger.error('Error during initialization: ' + error.message);
    }
}

initializeApp();
