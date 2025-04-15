export interface ConfigResponse {
    reportTime: string,
    granularity: number,
    wmbModes: string,
    fotaIp: string,
    update: string,
    allowedManufacturers: string,
    allowedTypes: string,
    srvAddr: string,
    currentTime: string,
    sendPeriod?: number;
    readPeriod?: number; 
}
