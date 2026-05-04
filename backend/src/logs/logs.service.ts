import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogsService {
  private logger = new Logger('App');

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  loginSuccess(userId: number, email: string, ip: string) {
    this.logger.log(`Login OK: ${email} (${userId}) from ${ip}`);
  }

  loginFailed(email: string, reason: string, ip: string) {
    this.logger.warn(`Login FAIL: ${email} - ${reason} (${ip})`);
  }

  attendanceRegistered(alumneId: number, sessioId: number, estat: string) {
    this.logger.log(
      `Attendance: alumne=${alumneId} sessio=${sessioId} estat=${estat}`,
    );
  }
}
