import { Exception } from '../../common/exceptions/exception';
import { Frame } from './interfaces/frame';

export class A1Frame implements Frame {

    private payload: string
    private imei: string;
    private imsi: string;
    private hwVersion: string;
    private fwVersion: string;
    private apn: string;
    private sequansVersion: string;

    constructor(payload: string){
        this.payload = payload;
        const properties = payload.split(';');
        this.isValidPayload(properties);
        this.imei = properties[0];
        this.imsi = properties[1];
        this.hwVersion = properties[2];
        this.fwVersion = properties[3];
        this.apn = properties[4];
    }
    
    private isValidPayload(properties: string[]): void{
        if (properties.length !== 6) {
            throw new Exception('A1Frame validation exception', `Invalid payload format: Expected exactly 6 properties. ${this.payload}`);
        }

        if (!properties[0].match(/^[a-zA-Z0-9]{15}$/)) {
            throw new Exception('A1Frame validation exception', `imei-format-error: ${this.payload} --> ${properties[0]}`);
        }

        if (!properties[1].match(/^[a-zA-Z0-9]*$/)) {
            throw new Exception('A1Frame validation exception', `imsi-format-error: ${this.payload} --> ${properties[1]}`);
        }

        if(!properties[2]){
            throw new Exception('A1Frame validation exception', `hwVersion-format-error: ${this.payload} --> ${properties[2]}`);
        }

        if(!properties[3]){
            throw new Exception('A1Frame validation exception', `swVersion-format-error: ${this.payload} --> ${properties[3]}`);
        }

        if(!properties[4]){
            throw new Exception('A1Frame validation exception', `apn-format-error: ${this.payload} --> ${properties[4]}`);
        }
    }

    public getImei(): string {
        return this.imei;
    }

    public getImsi(): string {
        return this.imsi;
    }

    public getHwVersion(): string {
        return this.hwVersion;
    }

    public getFwVersion(): string {
        return this.fwVersion;
    }

    public getApn(): string {
        return this.apn;
    }

    public getSequansVersion(): string {
        return this.sequansVersion;
    }
}
