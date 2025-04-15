import { RepositoryFactory } from '../../../common/factories/repository-factory';
import { A1FrameService } from '../services/a1-frame.service';
import { DeviceStatusFrameService } from '../services/device-status-frame.service';
import { Frame } from '../interfaces/frame';
import { FrameService } from '../interfaces/frame-service';
import { GreyListFrameService } from '../services/greylist-frame.service';
import { SigtecFrameService } from '../services/sigtec-frame.service';
import { WiotDataFrameService } from '../services/wiot-data-frame.service';
import { MqttSenderService } from '../../mqtt/mqtt-sender.service';
import { FrameType } from '../enum/frame-type';

type ServiceCreator = () => FrameService;

export class FrameServiceFactory {
    private repositoryFactory: RepositoryFactory;
    private services: Record<FrameType, ServiceCreator>;

    constructor(repositoryFactory: RepositoryFactory, timestamp: string) {
        this.repositoryFactory = repositoryFactory;
        this.services = {
            [FrameType.A1Frame]: () => new A1FrameService(this.repositoryFactory, timestamp),
            [FrameType.DeviceStatusFrame]: () => new DeviceStatusFrameService(this.repositoryFactory, timestamp),
            [FrameType.GreyListFrame]: () => new GreyListFrameService(this.repositoryFactory, timestamp),
            [FrameType.SigtecFrame]: () => new SigtecFrameService(this.repositoryFactory, timestamp),
            [FrameType.WiotDataFrame]: () => new WiotDataFrameService(this.repositoryFactory, timestamp)
        };
    }

    getService(frame: Frame): FrameService {
        const frameType = frame.constructor.name;
        const serviceCreator = this.services[frameType];
        if (!serviceCreator) {
            throw new Error(`No service available for frame type ${frameType}`);
        }
        return serviceCreator();
    }
}
