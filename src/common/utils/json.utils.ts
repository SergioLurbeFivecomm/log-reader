export class JSONUtils {

    public static isJsonValid(payload: string): boolean {
        try {
            const data = JSON.parse(payload);    
            return true;
        } catch (error) {
            return false;
        }
    }
}