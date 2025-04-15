import { Frame } from "./interfaces/frame";
import { Exception } from '../../common/exceptions/exception';

export class GreyListFrame implements Frame {
    private payload: string;
    private greyList: string[];
    private imei: string;

    constructor(imei: string, payload: string) {
        this.payload = payload;
        this.imei = imei;
        this.isValidPayload();
        this.greyList = this.parseSensorData(payload);
    }

    private isValidPayload(): void {
        const parts = this.payload.split(';');
        if (parts.length !== 2 || parts[0] !== 'greylist') {
            throw new Exception('Greylist Frame validation exception',`Invalid payload format: should start with "greylist; ${this.payload}`);
        }

        const sensors = parts[1].split(',');
        sensors.pop();
        const hexPattern = /^[0-9A-Fa-f]+$/;

        if (sensors.some(sensor => !hexPattern.test(sensor))) {
            throw new Exception('Greylist Frame validation exception', `Invalid payload format: all meter IDs should be hex characters --> ${this.payload}`);
        }
    }

    private parseSensorData(payload: string): string[] {
        return payload.split(';')[1].split(',').slice(0, -1);
    }

    public getGreylist(): string[] {
        return this.greyList;
    }
    

    public getImei(): string {
        return this.imei;
    }

    

}