import { WiotDataFrameHelper } from '../../common/helpers/wiot-data-frame.helper';
import { Frame } from './interfaces/frame';
import { WiotDataFields } from '../../common/interfaces/data-fields.interface';
import { DateUtils } from '../../common/utils/date.utils';
import { Exception } from '../../common/exceptions/exception';

export class WiotDataFrame implements Frame {
    private timestamp: string;
    private imei: string;
    private payload: string;
    private isSensusRf: boolean;
    private backupTime: string;
    private isSimpleFrame: boolean;
    private wiotData: WiotDataFields[];

    constructor(imei: string, payload: string, timestamp: string) {
        this.timestamp = timestamp;
        this.imei = imei;
        this.payload = payload;
        this.isValidPayload();
        const dayOfFrame = +payload.slice(0, 1)
        this.isSensusRf = this.determineSensusRf();
        this.backupTime = this.parseBackupTime(dayOfFrame);
        this.isSimpleFrame = (payload.charAt(1) == ';')? true : false;
        this.wiotData = this.parseData();
    }

    public determineSensusRf(): boolean {
        const trama = this.payload.substring(2);
        const longitud = parseInt(trama.substring(8, 10), 16);
        if (trama[12] == '4' && trama[13] == '4') return false;
        if (parseInt(trama[11], 16) < 4 && longitud == 14) return true;
        throw new Exception('IsSensusRf exception', `Trama de datos inválida: ${this.imei}`);
    }

    private isValidPayload(): void {
        const pattern = /^(\d+)([;:=])([0-9A-Fa-f]+)$/;
        const match = this.payload.match(pattern);

        if (!match) {
            throw new Exception('Wiot Data valadation exception',`Invalid payload format: ${this.payload}`);
        }
    }

    private parseBackupTime(dayOfFrame: number): string {
        const currentTime = this.timestamp;
        if (dayOfFrame >= 0 && dayOfFrame <= +process.env.BACKUP_LIMIT) {
            return DateUtils.subtractDaysFromDate(currentTime, dayOfFrame);
        } else {
            throw new Exception('Parse Backup Time',"Valor de backup fuera de rango");
        }
        
    }

    private parseData(): WiotDataFields[] {
        return this.isSimpleFrame
            ? WiotDataFrameHelper.parsePayloadSimple(this.payload)
            : WiotDataFrameHelper.parsePayload(this.payload);
    }

    public getIsSensusRf(): boolean {
        return this.isSensusRf;
    }

    public getBackupTime(): string {
        return this.backupTime;
    }

    public getWiotData(): WiotDataFields[]{
        return this.wiotData;
    }

    public getImei(): string {
        return this.imei;
    }

    public getPayload(): string {
        return this.payload;
    }

    public IsSimpleFrame(): boolean {
        return this.isSimpleFrame;
    }
}
