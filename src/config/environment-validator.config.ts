export class EnvironmentValidatorConfig {
    private requiredEnvVars: string[] = [
        'BROKER_IP',
        'BROKER_USR',
        'BROKER_PASS',
        'BROKER_PORT',
        'BACKUP_LIMIT',
        'READ_SEND_PERIODS_ENABLED',
        'DB_PORT',
        'DB_NAME',
        'DB_USERNAME',
        'DB_PASSWORD',
        'DB_HOST',
    ];

    constructor() {
        this.validateEnvVars();
    }

    private validateEnvVars(): void {
        this.requiredEnvVars.forEach((key) => {
            if (!process.env[key]) {
                throw new Error(`Environment variable ${key} is not defined`);
            }
        });
    }
}