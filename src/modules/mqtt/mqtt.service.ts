// import * as mqtt from 'mqtt';
// import { RepositoryFactory } from '../../common/factories/repository-factory';
// import { MqttSenderService } from './mqtt-sender.service';
// import { logger } from '../../config/winston-config';
// import { FrameFactory } from '../frames/factories/frame.factory';
// import { Exception } from '../../common/exceptions/exception';
// import { FrameServiceFactory } from '../frames/factories/frame-service.factory';
// import { IBrokerConfig } from 'src/common/interfaces/broker-config.interface';



// export class MqttService {
//     private client: mqtt.MqttClient;
//     private repositoryFactory: RepositoryFactory;
//     private mqttSenderService: MqttSenderService;
//     private subscribedTopics: Set<string> = new Set();

//     constructor(
//         brokerConfig: IBrokerConfig,
//         repositoryFactory: RepositoryFactory
//     ) {
//         if (!brokerConfig.brokerIp || !brokerConfig.brokerPort || !brokerConfig.brokerUsr || !brokerConfig.brokerPass) {
//             throw new Exception(
//                 'MqttException',
//                 `One or more connection parameters for MQTT are undefined: 
//                 brokerIp: ${brokerConfig.brokerIp}
//                 brokerPort: ${brokerConfig.brokerPort}
//                 brokerUsr: ${brokerConfig.brokerUsr}
//                 brokerPass: ${brokerConfig.brokerPass}`
//             );
//         }

//         const options: mqtt.IClientOptions = {
//             clean: true,
//             reconnectPeriod: 5000,
//             clientId: `mqttClient_${Math.random().toString(16).slice(2)}`,
//             username: brokerConfig.brokerUsr,
//             password: brokerConfig.brokerPass
//         };

//         this.client = mqtt.connect(`mqtt://${brokerConfig.brokerIp}:${brokerConfig.brokerPort}`, options);

//         this.mqttSenderService = new MqttSenderService(this.client);

//         this.repositoryFactory = repositoryFactory;

//         this.setupEventListeners();
//     }

//     private setupEventListeners(): void {
//         this.client.on('connect', () => {
//             logger.info('Connected to broker');
//             this.subscribe();
//         });

//         this.client.on('reconnect', () => {
//             logger.info('Reconnecting to MQTT broker...');
//         });

//         this.client.on('error', error => {
//             logger.error('Connection error: ' + error.message);
//         });

//         this.client.on('close', () => {
//             logger.warn('Disconnected from MQTT broker');
//         });

//         this.client.on('message', (topic, message) => {
//             if(this.isTopicRegistered(topic)) {
//                 this.processMessage(topic, message);
//             }
//         });
//     }

//     public getClient(): mqtt.MqttClient {
//         return this.client;
//     }

//     private subscribe(topic: string = '#'): void {
//         if (!this.subscribedTopics.has(topic)) {
//             this.client.subscribe(topic, (error, granted) => {
//                 if (error) {
//                     logger.error('Subscription error: ' + error.message);
//                 } else {
//                     granted.forEach(grant => {
//                         logger.info(`Subscribed to topic '${grant.topic}' with QoS ${grant.qos}`);
//                         this.subscribedTopics.add(grant.topic);
//                     });
//                 }
//             });
//         }
//     }

//     private async processMessage(topic: string, buffer: Buffer): Promise<void> {
        
//         const message = this.parseBufferIfBinary(buffer);
//         logger.info(`Message received on ${topic}: ${message}`);
//         try {
//             const frameFactory = new FrameFactory();
//             const frame = frameFactory.createFrame(topic, message);
//             const serviceFactory = new FrameServiceFactory(this.mqttSenderService, this.repositoryFactory);
//             const frameService = serviceFactory.getService(frame);
//             await frameService.handleMessage(frame);
//         } catch (error) {
//             if (error instanceof Exception) {
//                 logger.warn(`${error.name} ${error.message}`);
//             } else {
//                 logger.error(`Unhandled error: ${error.message}`);
//             }
//         }
//     }

//     private isTopicRegistered(topic: string): boolean {
//         return topic.startsWith('t') || topic.startsWith('a1');
//     }

//     private parseBufferIfBinary(buffer: Buffer): string {
//         if (buffer[1] == 61) {
//             return buffer.subarray(0, 2).toString() + buffer.subarray(2).toString('hex');
//         }
//         return buffer.toString();
//     }
    
// }
