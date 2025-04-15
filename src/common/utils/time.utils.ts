export class TimeUtils {

    static checkRangeHourMinutesSeconds(hour: string, minutes: string, seconds: string): boolean {
        const hourInt = parseInt(hour, 10);
        const minutesInt = parseInt(minutes, 10);
        const secondsInt = parseInt(seconds, 10);

        const isHourValid = !isNaN(hourInt) && hourInt >= 0 && hourInt < 24;
        const isMinutesValid = !isNaN(minutesInt) && minutesInt >= 0 && minutesInt < 60;
        const isSecondsValid = !isNaN(secondsInt) && secondsInt >= 0 && secondsInt < 60;

        return isHourValid && isMinutesValid && isSecondsValid;
    }
}