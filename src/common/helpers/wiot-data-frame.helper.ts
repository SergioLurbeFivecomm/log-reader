import { logger } from "../../config/winston-config";
import { WiotDataFields } from "../interfaces/interfaces";
import { ExceptionHandler, exceptions } from "winston";

export class WiotDataFrameHelper {
    static parsePayload(payload: string): WiotDataFields[] {
        try {
            const trama: string = payload.substring(2);
            const tramasAgregadas: Set<string> = new Set();
            const tramaBinary: string = parseInt(trama, 16)
                .toString(2)
                .padStart(trama.length * 4, '0');
            let datosList: Array<WiotDataFields> = [];
            let i: number = 0;

            while (i < tramaBinary.length) {
                const hora: string = trama.substring(i, i + 2);
                const minutos: string = trama.substring(i + 2, i + 4);
                const segundos: string = trama.substring(i + 4, i + 6);
                const longitud: number = parseInt(trama.substring(i + 8, i + 10), 16);
                if (hora !== '') {
                    const rssi: number = parseInt(trama.substring(i + 6, i + 8), 16) * -1;
                    const dato: string = trama.substring(i + 10, i + 10 + longitud * 2);
                    const horaStr: string = parseInt(hora, 16).toString().padStart(2, '0');
                    const minutoStr: string = parseInt(minutos, 16).toString().padStart(2, '0');
                    const segundoStr: string = parseInt(segundos, 16).toString().padStart(2, '0');
                    const tramaKey: string = `${horaStr}-${minutoStr}-${segundoStr}-${dato}`;

                    if (!tramasAgregadas.has(tramaKey)) {
                        datosList.push({
                            hora: parseInt(horaStr),
                            minutos: parseInt(minutoStr),
                            segundos: parseInt(segundoStr),
                            RSSI: rssi,
                            datos: dato
                        });
                        tramasAgregadas.add(tramaKey);
                    }
                }
                i += 10 + longitud * 2;
            }

            // if (datosList.length > 0 && datosList[0].hora === 23) {
            //     if (datosList.length != 1) datosList.shift();
            // } 

            // datosList = this.correctHours(datosList);
            //return JSON.stringify(datosList, null, 4);
            return datosList;
        } catch (error) {
            logger.error('Error in WiotDataFrame.parsePayload: ' + error.message);
        }
    }


    

    // private isSensusRF(payload: string): boolean {
    //     const trama: string = payload.split(':')[1];
    //     const longitud: number = parseInt(trama.substring(8, 10), 16);
    //     if (trama[12] == '4' && trama[13] == '4') return false;
    //     if (parseInt(trama[11], 16) < 4 && longitud == 14) return true;
    //     throw new Error(`Trama de datos inválida: ${this.imei}`);
    // }



    static parsePayloadSimple(payload: string): WiotDataFields[] {
        try {
            const trama: string = payload.split(';')[1];
            const tramasAgregadas: Set<string> = new Set();
            const tramaBinary: string = parseInt(trama, 16)
                .toString(2)
                .padStart(trama.length * 4, '0');
            let datosList: Array<WiotDataFields> = [];
            let i: number = 0;

            while (i < tramaBinary.length) {
                const hora: string = trama.substring(i, i + 2);
                const longitud: number = parseInt(trama.substring(i + 4, i + 6), 16);
                if (hora !== '') {
                    const rssi: number = parseInt(trama.substring(i + 2, i + 4), 16) * -1;
                    const dato: string = trama.substring(i + 6, i + 6 + longitud * 2);
                    const horaStr: string = parseInt(hora, 16).toString().padStart(2, '0');
                    const tramaKey: string = `${horaStr}-${dato}`; // Create a unique key for the frame

                    if (!tramasAgregadas.has(tramaKey)) {
                        // Check if the frame is already added
                        datosList.push({
                            hora: parseInt(horaStr),
                            RSSI: rssi,
                            datos: dato
                        });
                        tramasAgregadas.add(tramaKey); // Add the frame to the set of frames
                    }
                }
                i += 6 + longitud * 2;
            }

            if (datosList.length > 0 && datosList[0].hora === 23) {
                if (datosList.length != 1) datosList.shift();
            } 

            //datosList = this.correctHours(datosList);
            //return JSON.stringify(datosList, null, 4);
            return datosList;
        } catch (error) {
            logger.error('Error in WiotDataFrame.parsePayload: ' + error.message);
        }
    }


    
}