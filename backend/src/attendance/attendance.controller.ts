import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Post, Body, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ExportService } from '../export/export.service';
import { UsersService } from '../users/users.service';
import type { Response } from 'express';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly exportService: ExportService,
    private readonly usersService: UsersService,
  ) {}

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

  @Get('export/csv/:modulId')
  async exportCsv(
    @Param('modulId') modulId: string,
    @Res() res: Response,
  ) {
    const students = await this.usersService.getModulStudents(Number(modulId));
    if (!students) throw new BadRequestException('Mòdul no trobat');

    const data = students.map(s => ({
      Nom: s.nom,
      Email: s.email,
      Estat: s.estat,
      Faltes: s.faltas_acumuladas,
      Retards: s.retrasos_acumulados,
    }));

    const buffer = await this.exportService.exportToCsv(data, `assistencia_${modulId}.csv`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=assistencia_${modulId}.csv`);
    res.send(buffer);
  }

  @Get('export/pdf/:modulId')
  async exportPdf(
    @Param('modulId') modulId: string,
    @Res() res: Response,
  ) {
    const students = await this.usersService.getModulStudents(Number(modulId));
    if (!students) throw new BadRequestException('Mòdul no trobat');

    const data = students.map(s => ({
      nom: s.nom,
      email: s.email,
      estat: s.estat,
      faltas: s.faltas_acumuladas,
      retards: s.retrasos_acumulados,
    }));

    const columns = [
      { label: 'Alumne', key: 'nom' },
      { label: 'Email', key: 'email' },
      { label: 'Estat Avui', key: 'estat' },
      { label: 'Faltes', key: 'faltas' },
      { label: 'Retards', key: 'retards' },
    ];

    const buffer = await this.exportService.exportToPdf(
      data,
      `assistencia_${modulId}.pdf`,
      `Report d'Assistència - Mòdul ${modulId}`,
      columns
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=assistencia_${modulId}.pdf`);
    res.send(buffer);
  }
}
