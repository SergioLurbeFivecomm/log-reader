import { Frame } from "./interfaces/frame";


export class SigtecFrame implements Frame {
    private imei: string;
    private battery: number;
    private coverageValues: string[];
    private cc: number;
    private nc: string;
    private tac: number;
    private band: string;
    private earfcn: number;
    private rsrp: number;
    private rsrq: number;
    private pwd: number;
    private paging: number;
    private cid: string;
    private bw: number;
    private idCov: string;
    private timestamp: string;


    constructor(imei: string, payload: string, timestamp: string){
        this.timestamp = timestamp;
        this.imei = imei;
        const coverageValues = this.extractCoverageValues(payload.split(';'));
        this.transformToCoverage(coverageValues);
        let splitPayload = payload.split(';');
        this.battery = parseFloat(splitPayload[splitPayload.length - 2]);
    }


    private extractCoverageValues(payloadParts: string[]): Record<string, string> {
        const frameCoverage = payloadParts[payloadParts.length - 3];
        return frameCoverage.split(' ').reduce((result, value) => {
            const [key, val] = value.split(':');
            if (key && val) {
                result[key] = val;
            }
            return result;
        }, {});
    }

    private transformToCoverage(values: Record<string, string>): void {
        this.cc = parseInt(values['Cc'], 10);
        this.nc = values['Nc'];
        this.tac = parseInt(values['TAC'], 10);
        this.band = values['BAND'];
        this.earfcn =  parseInt(values['EARFCN'], 10);
        this.rsrp =  parseFloat(values['RSRP']);
        this.rsrq =  parseFloat(values['RSRQ']);
        this.pwd =  parseInt(values['PWR'], 10);
        this.paging =  parseInt(values['PAGING'], 10);
        this.cid =  values['CID'];
        this.bw =  parseInt(values['BW'], 10);
        this.idCov =  values['Id'];
    }


    public getCoverageValues(): string[] {
        return this.coverageValues;
    }

    public getImei(): string {
        return this.imei;
    }

    public getBattery(): number {
        return this.battery;
    }

    public getCc(): number {
        return this.cc;
    }

    public getNc(): string {
        return this.nc;
    }

    public getTac(): number {
        return this.tac;
    }

    public getBand(): string {
        return this.band;
    }

    public getEarfcn(): number {
        return this.earfcn;
    }

    public getRsrp(): number {
        return this.rsrp;
    }

    public getRsrq(): number {
        return this.rsrq;
    }

    public getPwd(): number {
        return this.pwd;
    }

    public getPaging(): number {
        return this.paging;
    }

    public getCid(): string {
        return this.cid;
    }

    public getBw(): number {
        return this.bw;
    }

    public getIdCov(): string {
        return this.idCov;
    }

    public getTimestamp(): string {
        return this.timestamp;
    }
}