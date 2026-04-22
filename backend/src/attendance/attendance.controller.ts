import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post('generate')
  async generate(
    @Body()
    data: {
      modulId: number;
      professorId: number;
      lateMinutes: number;
      absentMinutes: number;
    },
  ) {
    return await this.attendanceService.generateToken(
      data.modulId,
      data.professorId,
      data.lateMinutes,
      data.absentMinutes,
    );
  }

  @Post('validate')
  async validateQr(@Body() body: { token: string; alumneId: number }) {
    if (!body.token || !body.alumneId) {
      throw new BadRequestException('Token i alumneId són obligatoris');
    }

    return await this.attendanceService.registrarAssistencia(
      body.alumneId,
      body.token,
    );
  }

  @Post('register')
  async registerManual(
    @Body() data: { alumneId: number; modulId: number; estat: string },
  ) {
    return await this.attendanceService.registerManualAttendance(
      data.alumneId,
      data.modulId,
      data.estat,
    );
  }
}
