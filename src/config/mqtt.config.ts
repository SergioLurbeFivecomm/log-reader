import { IBrokerConfig } from '../common/interfaces/broker-config.interface';

export const BrokerConfig: IBrokerConfig = {
    brokerIp: process.env.BROKER_IP,
    brokerUsr: process.env.BROKER_USR,
    brokerPass: process.env.BROKER_PASS,
    brokerPort: +process.env.BROKER_PORT
}