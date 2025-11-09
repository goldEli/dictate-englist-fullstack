import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const correlationId =
      request.headers['x-correlation-id'] || this.generateCorrelationId();

    request.correlationId = correlationId;

    const startTime = Date.now();

    this.logger.http(`Request: ${method} ${url} - Started`, 'HTTP');

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.http(
          `Request: ${method} ${url} - ${statusCode} - ${duration}ms - correlationId: ${correlationId} - ip: ${ip} - userAgent: ${userAgent}`,
          'HTTP',
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        this.logger.error(
          `Request: ${method} ${url} - ${statusCode} - ${duration}ms - correlationId: ${correlationId} - Error: ${error.message}`,
          error.stack,
          'HTTP',
        );

        throw error;
      }),
    );
  }

  private generateCorrelationId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
