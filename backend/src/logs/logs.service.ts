import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogsService {
  private readonly logger = new Logger('App');

  info(message: string, context?: string) {
    this.logger.log(message, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  // Log an error (standard)
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  /**
   * Log a critical error with stack trace and optional metadata.
   * This method mirrors the previous implementation used by HttpErrorFilter.
   */
  criticalError(error: Error, context: string, meta?: Record<string, unknown>) {
    // The Nest Logger does not accept a meta object, so we include the
    // context and the error's stack trace in the message.
    const message = error.message;
    const trace = error.stack;
    // Log at error level (critical). The meta can be logged via a separate
    // logger call if needed; for simplicity we append JSON stringified meta.
    if (meta && Object.keys(meta).length) {
      this.logger.error(
        `${message} | meta: ${JSON.stringify(meta)}`,
        trace,
        context,
      );
    } else {
      this.logger.error(message, trace, context);
    }
  }
}
