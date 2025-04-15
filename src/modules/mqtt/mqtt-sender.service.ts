
import { MqttClient } from 'mqtt';
import { logger } from '../../config/winston-config';


export class MqttSenderService {
    private client: MqttClient;

    constructor(client: MqttClient) {
        this.client = client;
    }

    public sendMessage(topic: string, message: string): void {
        this.client.publish(topic, message, {}, err => {
            if (err) {
                logger.error('Error publishing message', err);
            } else {
                logger.info(`${topic} ${message}`)
            }
        });
    }
}
