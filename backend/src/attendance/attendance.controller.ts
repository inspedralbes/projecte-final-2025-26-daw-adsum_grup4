import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('api/assistencia')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post('generar')
  async generar(
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

  @Post('validar')
  async validar(@Body() body: { tokenValue: string; alumneId: number }) {
    if (!body.tokenValue || !body.alumneId) {
      throw new BadRequestException('Token i alumneId són obligatoris');
    }

    return await this.attendanceService.registrarAssistencia(
      body.alumneId,
      body.tokenValue,
    );
  }

  @Post('manual')
  async manual(
    @Body() data: { alumneId: number; modulId: number; estat: string },
  ) {
    return await this.attendanceService.registerManualAttendance(
      data.alumneId,
      data.modulId,
      data.estat,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('sortida')
  async sortida(@Body() body: { alumneId: number; motiu: any }) {
    return await this.attendanceService.registrarSortida(body.alumneId, body.motiu);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tornada')
  async tornada(@Body() body: { alumneId: number }) {
    return await this.attendanceService.registrarTornada(body.alumneId);
  }
}
