import { Address, Alarms, Coverage, Device } from "../entities/entitities";


import { DeviceStatusFrame } from '../../modules/frames/device-status.frame';
import { Config } from "src/modules/frames/interfaces/config.interface";
import { timeEnd, timeStamp } from 'console';

export class DeviceStatusHelper {
    static allowedModes = ['T1', 'C1a', 'C1b', 'SensusRF']; 

    static prepareDevice(deviceStatusFrame: DeviceStatusFrame, device: Device): Device {
        const config: Config = deviceStatusFrame.getConfig();

        const battery = deviceStatusFrame.getBattery();
        if (battery) device.battery = battery;

        if (config.reportTime) {
            device.reportTime = config.reportTime;
        }
        if (config.granularity) {
            device.wmbMeasurementWindow = config.granularity;
        }
        if (config.wmbModes && this.validateWmbModes(config.wmbModes)) {
            device.wmbModes = config.wmbModes;
        }
        if (config.update) {
            device.fota = config.update;
        }
        if (config.allowedManufacturers) {
            device.filterManufacturer = config.allowedManufacturers;
        }
        if (config.allowedTypes) {
            device.filterVertical = config.allowedTypes;
        }
        if (config.readPeriod) {
            device.readPeriod = config.readPeriod;

        }if (config.sendPeriod) {
            device.sendPeriod = config.sendPeriod;
        }
        return device;
    }

    
    // static determineAddress(config: Config, address: Address ): Address {
    //     if (config.srvAddr[0] == address.primary && config.srvAddr[1] == address.secondary && config.fotaIp == address.fotaIp) {
    //         return address;
    //     } else {
    //         return {
    //             primary: config.srvAddr[0],
    //             secondary: config.srvAddr[1],
    //             fotaIp: config.fotaIp
    //         }
    //     }
    // }

    static prepareAlarms(alarmsList: string[], device: Device, timestamp: string): Alarms {
        const alarms = new Alarms();
        alarms.device = device;
        alarms.timestamp = timestamp;
        alarms.sdNotDetected = 0;
        alarms.sdFormated = 0;
        alarms.sdCouldNotFormat = 0;
        alarms.noWmbRead = 0;
        alarms.primaryServerFailed = 0;
        alarms.allBackupsFilled = 0;
        alarms.simFailed = 0;
        alarms.epromFailed = 0;
        alarms.sdCouldNotMount = 0;

        alarmsList.forEach(alarm => {
            switch (alarm) {
                case "sd_not_detected":
                    alarms.sdNotDetected = 1;
                    break;
                case "sd_formated":
                    alarms.sdFormated = 1;
                    break;
                case "sd_could_not_format":
                    alarms.sdCouldNotFormat = 1;
                    break;
                case "no_wmb_read":
                    alarms.noWmbRead = 1;
                    break;
                case "primary_server_failed":
                    alarms.primaryServerFailed = 1;
                    break;
                case "all_backups_filled":
                    alarms.allBackupsFilled = 1;
                    break;
                case "sim_failed":
                    alarms.simFailed = 1;
                    break;
                case "eprom_failed":
                    alarms.epromFailed = 1;
                    break;
                case "sd_could_not_mount":
                    alarms.sdCouldNotMount = 1;
                    break;
            }
        });
        return alarms;
    }

    static prepareCoverage(sigtec: string, device: Device, timestamp: string): Coverage {
        const sigtecParts = sigtec.split(';');
        const coverageValues = this.extractCoverageValues(sigtecParts);
        return this.transformToCoverage(coverageValues, device, timestamp);

    }

    private static validateWmbModes(modes: string): boolean {
        if(!modes) return false;
        if (modes.length == 1 && !modes.includes(',')) {
            return this.allowedModes.includes(modes);
        }
        const modeArray = modes.split(',');
        return modeArray.every(mode => this.allowedModes.includes(mode));
    }

    private static extractCoverageValues(coverageParts: string[]): Record<string, string> {
        return coverageParts[0].split(' ').reduce((result, value) => {
            const [key, val] = value.split(':');
            if (key && val) {
                result[key] = val;
            }
            return result;
        }, {});
    }

    private static transformToCoverage(values: Record<string, string>, device: Device, timestamp: string): Coverage {
        return {
            cc: parseInt(values['Cc'], 10),
            nc: values['Nc'],
            tac: parseInt(values['TAC'], 10),
            band: values['BAND'],
            earfcn: parseInt(values['EARFCN'], 10),
            rsrp: parseFloat(values['RSRP']),
            rsrq: parseFloat(values['RSRQ']),
            pwd: parseInt(values['PWR'], 10),
            paging: parseInt(values['PAGING'], 10),
            cid: values['CID'],
            bw: parseInt(values['BW'], 10),
            idCov: values['Id'],
            timestamp: timestamp,
            device: device
        };
    }
}