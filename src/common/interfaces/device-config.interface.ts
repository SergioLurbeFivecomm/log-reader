export interface DeviceConfig {
    reportTime: string | null;
    granularity: number | null;
    fotaIp: string | null;
    update: string | null;
    allowedManufacturers: string | null;
    allowedTypes: string | null;
    srvAddr: string[] | null;
    wmbModes: string | null;
}
