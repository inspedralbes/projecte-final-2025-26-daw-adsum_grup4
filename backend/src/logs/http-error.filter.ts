/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from './logs.service';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any)?.message || exception.message;

      error = exception.name;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error intern del servidor';
      error = 'InternalServerError';

      const errMessage =
        exception instanceof Error ? exception.message : String(exception);

      const stack = exception instanceof Error ? exception.stack : undefined;

      this.logsService.criticalError(errMessage, stack, 'HttpErrorFilter');
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    response.status(status).json(responseBody);
  }
}
