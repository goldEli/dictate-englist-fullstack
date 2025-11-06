import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import { loggerConfig } from '../config/logger.config';

@Injectable()
export class AppLogger extends Logger {
  private winstonLogger: winston.Logger;
  private loggerContext: string;

  constructor() {
    super();
    this.winstonLogger = winston.createLogger(loggerConfig);
    this.loggerContext = 'App';
  }

  setContext(context: string) {
    this.loggerContext = context;
  }

  log(message: any, context?: string) {
    this.winstonLogger.info(message, { context: context || this.loggerContext });
    super.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.winstonLogger.error(message, {
      context: context || this.loggerContext,
      trace
    });
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, { context: context || this.loggerContext });
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    this.winstonLogger.debug(message, { context: context || this.loggerContext });
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    this.winstonLogger.verbose(message, { context: context || this.loggerContext });
    super.verbose(message, context);
  }

  http(message: any, context?: string) {
    this.winstonLogger.http(message, { context: context || this.loggerContext });
  }
}
