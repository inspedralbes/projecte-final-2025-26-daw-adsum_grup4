import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  loginSuccess(userId: number, email: string, ip?: string) {
    console.log(`[LOGIN SUCCESS] user=${userId} email=${email} ip=${ip}`);
  }

  loginFailed(email: string, reason: string, ip?: string) {
    console.log(`[LOGIN FAILED] email=${email} reason=${reason} ip=${ip}`);
  }

  attendanceRegistered(alumneId: number, sessioId: number, estat: string) {
    console.log(
      `[ATTENDANCE] alumne=${alumneId} sessio=${sessioId} estat=${estat}`,
    );
  }

  warn(message: string, context?: string, meta?: any) {
    console.warn(`[WARN] ${message}`, meta);
  }

  criticalError(exception: Error, context?: string, meta?: any) {
    console.error(`[CRITICAL ERROR] ${exception.message}`, {
      stack: exception.stack,
      context,
      ...meta,
    });
  }
}
