import { A1Frame, DeviceStatusFrame, GreyListFrame, SigtecFrame, WiotDataFrame } from '../frames';
import { Frame } from '../interfaces/frame';
import { Exception } from '../../../common/exceptions/exception';

export class FrameFactory {
    constructor() {}

    createFrame(topic: string, message: string, timestamp: string): Frame {
        if (topic === 'a1') {
            return new A1Frame(message);
        } else if (topic.startsWith('t')) {
            const imei = topic.substring(1);
            if (message.startsWith('{')) {
                return new DeviceStatusFrame(imei, message);
            } else if (message.startsWith('sigtec')){
                return new SigtecFrame(imei, message, timestamp);
            } if (message.startsWith('greylist')) {
                return new GreyListFrame(imei, message);
            } else {
                return new WiotDataFrame(imei, message, timestamp);
            }
        }
        throw new Exception('Frame Factory exception', `Received message from unhandled topic ${topic}`);
    }
}