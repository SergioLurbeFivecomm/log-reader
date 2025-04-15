import { DateTime } from 'luxon';

export class DateUtils {

    static getCurrentDateStringFormat(): string {
        return DateTime.now().setZone(process.env.TIMEZONE).toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static getCurrentDateTimeEuropeMadridString(): string {
        return DateTime.now().setZone('Europe/Madrid').toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static getCurrentDateTimeStringByTimeZone(timeZone: string): string {
        return DateTime.now().setZone(`${timeZone}`).toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static getCurrentDateTimeEuropeMadrid(): DateTime {
        return DateTime.now().setZone('Europe/Madrid');
    }

    static getCurrentDateAmericaMexicoCityString(): Date {
        return new Date(DateTime.now().setZone('America/Mexico_City').toFormat('yyyy-MM-dd HH:mm:ss'));
    }

    static getCurrentDateEuropeMadridString(): Date {
        return new Date(DateTime.now().setZone('Europe/Madrid').toFormat('yyyy-MM-dd HH:mm:ss'));
    }

    static getCurrentDateGmt(): Date {
        return new Date(DateTime.now().setZone('UTC').toFormat('yyyy-MM-dd HH:mm:ss'));
    }

    static getCurrentDateTimeGmtString(): string {
        return DateTime.now().setZone('UTC').toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static addHoursToDate(date: DateTime, hours: number): DateTime {
        return date.plus({ hours: hours });
    }

    static subtractHoursFromDate(date: DateTime, hours: number): DateTime {
        return date.minus({ hours: hours });
    }

    static subtractDaysFromDate(currentDate: string, days: number): string {
        const date = DateTime.fromFormat(currentDate, 'yyyy-MM-dd HH:mm:ss');
        const newDate = date.minus({ days: days });
        return newDate.toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static addDaysToDate(date: DateTime, days: number): DateTime {
        return date.plus({ days: days });
    }
}
