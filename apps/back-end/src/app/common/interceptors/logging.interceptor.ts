import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          const logData = {
            timestamp: new Date().toISOString(),
            level: 'info',
            method,
            url,
            statusCode,
            responseTime: `${responseTime}ms`,
            body: method !== 'GET' ? body : undefined,
            query: Object.keys(query).length > 0 ? query : undefined,
            params: Object.keys(params).length > 0 ? params : undefined,
          };

          console.log(JSON.stringify(logData));
        },
        error: (error) => {
          const responseTime = Date.now() - now;

          const logData = {
            timestamp: new Date().toISOString(),
            level: 'error',
            method,
            url,
            statusCode: error.status || 500,
            responseTime: `${responseTime}ms`,
            error: {
              message: error.message,
              name: error.name,
            },
            body: method !== 'GET' ? body : undefined,
            query: Object.keys(query).length > 0 ? query : undefined,
            params: Object.keys(params).length > 0 ? params : undefined,
          };

          console.error(JSON.stringify(logData));
        },
      })
    );
  }
}
