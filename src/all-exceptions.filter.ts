import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Catch,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { LogsService } from './app.logs/logs.service';

@Catch()
export class allExceptionsFilter implements ExceptionFilter {
  private readonly logs = new LogsService();
  // get ip address from request
  private getIpAddress(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      return Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : String(forwardedFor);
    }
    return request.ip || 'unknown';
  }
  constructor(private readonly httpAdapter: HttpAdapterHost['httpAdapter']) {}
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception caught by allExceptionsFilter:', exception);
    const { httpAdapter } = this;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: String(httpAdapter.getRequestUrl(request)),
      message,
    });
    // Log the error to a file
    const logMessage = `Error: ${JSON.stringify(
      message,
    )}, Status: ${status}, Path: ${httpAdapter.getRequestUrl(request)}`;
    const ipAddress = this.getIpAddress(request);
    this.logs.logToFile(logMessage, ipAddress).catch((error: any) => {
      console.error('Failed to log error:', error);
    });
  }
}
