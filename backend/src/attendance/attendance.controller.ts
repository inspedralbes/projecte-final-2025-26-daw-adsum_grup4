import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('validate')
    async validateQr(@Body() body: { token: string, alumneId: number }) {
        if (!body.token || !body.alumneId) {
            throw new BadRequestException('Token i alumneId són obligatoris');
        }

        return await this.attendanceService.registrarAssistencia(body.alumneId, body.token);
    }
}
