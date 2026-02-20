import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('generate')
    async generate(@Body() data: { modulId: number, professorId: number, lateMinutes: number, absentMinutes: number }) {
        return await this.attendanceService.generateToken(
            data.modulId,
            data.professorId,
            data.lateMinutes,
            data.absentMinutes
        );
    }

    @Post('validate')
    async validateQr(@Body('token') token: string) {
        if (!token) {
            throw new BadRequestException('El token es obligatori');
        }

        const result = await this.attendanceService.validateToken(token);

        if (result.isValid) {
            return {
                success: true,
                message: 'Assistència registrada correctament',
                estat: result.estat
            };
        } else {
            throw new BadRequestException('Token no vàlid o expirat');
        }
    }

    @Post('register')
    async registerManual(@Body() data: { alumneId: number, modulId: number, estat: string }) {
        return await this.attendanceService.registerManualAttendance(
            data.alumneId,
            data.modulId,
            data.estat
        );
    }
}
