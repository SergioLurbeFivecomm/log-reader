import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss' // Formato de la fecha y hora
  }),
  winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);

export const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: path.join(__dirname, '../../log'), 
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    }),
    new winston.transports.Console({
      format: logFormat,
      level: 'info'
    })
    
  ]
});

// Escribe un log justo después de crear el logger
logger.info('Logger initialized');
