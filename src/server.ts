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

        const repositoryFactory = new RepositoryFactory(AppDataSource);
        const messageProcessor = new MessageProcessorService(repositoryFactory);
        const schemaValidator = new SchemaValidator(AppDataSource);
        await schemaValidator.validate();

        for (let day = 9; day <= 15; day++) {
            const dayStr = day.toString().padStart(2, '0');
            const filePath = `./nb-pro-2025-04-${dayStr}.log`;

            logger.info(`🍆 Procesando archivo: ${filePath}`);
            const logReaderService = new LogReaderService(filePath, messageProcessor);
            await logReaderService.readLogFile();
            logger.info(`✅ Archivo ${filePath} procesado`);
        }

    } catch (error) {
        logger.error('💥 Error during initialization:', error);
    }
}

initializeApp();
