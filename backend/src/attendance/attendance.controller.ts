import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('validate')
  async validateQr(@Body('token') token: string) {
    const startTime = Date.now();
    
    if (!token) {
      throw new BadRequestException('El token es obligatori');
    }

    const isValid = await this.attendanceService.validateToken(token);
    const duration = Date.now() - startTime;

    if (isValid) {
      return {
        success: true,
        message: 'Assistència registrada correctament',
        duration,
      };
    } else {
      throw new BadRequestException('Token no vàlid o expirat');
    }
  }
}
