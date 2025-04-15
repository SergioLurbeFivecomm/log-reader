import * as mqtt from 'mqtt';
import { RepositoryFactory } from '../../common/factories/repository-factory';
import { logger } from '../../config/winston-config';
import { FrameFactory } from '../frames/factories/frame.factory';
import { Exception } from '../../common/exceptions/exception';
import { FrameServiceFactory } from '../frames/factories/frame-service.factory';
import { IBrokerConfig } from 'src/common/interfaces/broker-config.interface';



export class MessageProcessorService {
    private client: mqtt.MqttClient;
    private repositoryFactory: RepositoryFactory;
    private subscribedTopics: Set<string> = new Set();

    constructor(
        repositoryFactory: RepositoryFactory
    ) {
        this.repositoryFactory = repositoryFactory;
    }


    async processMessage(timestamp: string, topic: string, message: string): Promise<void> {
        

        logger.info(`Message received on ${topic}: ${message}`);
        try {
            const frameFactory = new FrameFactory();
            const frame = frameFactory.createFrame(topic, message, timestamp);
            const serviceFactory = new FrameServiceFactory(this.repositoryFactory, timestamp);
            const frameService = serviceFactory.getService(frame);
            await frameService.handleMessage(frame);
        } catch (error) {
            if (error instanceof Exception) {
                logger.warn(`${error.name} ${error.message}`);
            } else {
                logger.error(`Unhandled error: ${error.message}`);
            }
        }
    }

    private isTopicRegistered(topic: string): boolean {
        return topic.startsWith('t') || topic.startsWith('a1');
    }

    private parseBufferIfBinary(buffer: Buffer): string {
        if (buffer[1] == 61) {
            return buffer.subarray(0, 2).toString() + buffer.subarray(2).toString('hex');
        }
        return buffer.toString();
    }
    
}
