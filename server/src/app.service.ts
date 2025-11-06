import { Injectable } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('AppService');
    this.logger.log('Application starting', 'AppService');
  }

  getHello(): string {
    this.logger.debug('Health check performed', 'getHello');
    return 'Hello World!';
  }
}
