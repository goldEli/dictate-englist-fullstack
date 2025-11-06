import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `[${timestamp}] [${level}] [${context}] ${message} ${metaString}`;
  }),
);

const transports: winston.transport[] = [];

if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: developmentFormat,
    }),
  );
}

if (isProduction) {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: customFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  );

  transports.push(
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: customFormat,
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  );

  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: customFormat,
    }),
  );
}

if (!isDevelopment && !isProduction) {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: developmentFormat,
    }),
  );
}

export const loggerConfig: winston.LoggerOptions = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  level: isDevelopment ? 'debug' : 'info',
  transports,
  exitOnError: false,
};
