import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { Assistencia } from '../entities/assistencia.entity';
@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(AttendanceToken)
        private readonly tokenRepository: Repository<AttendanceToken>,
        @InjectRepository(Assistencia)
        private readonly assistenciaRepository: Repository<Assistencia>,
    ) { }

    async generateToken(
        modulId: number,
        professorId: number,
        lateMinutes: number = 15,
        absentMinutes: number = 30
    ): Promise<AttendanceToken> {
        // Generar un código de 6 dígitos
        const tokenValue = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2); // Codi vàlid per a tota la classe (2 hores)

        const newToken = this.tokenRepository.create({
            token: tokenValue,
            modulId: modulId,
            professorId: professorId,
            lateMinutes: lateMinutes,
            absentMinutes: absentMinutes,
            expiresAt: expiresAt,
            isUsed: false,
        });

        return await this.tokenRepository.save(newToken);
    }

    async validateToken(tokenValue: string): Promise<{ isValid: boolean, estat?: string }> {
        const token = await this.tokenRepository.findOne({
            where: { token: tokenValue },
        });

        if (!token) return { isValid: false };

        const now = new Date();
        if (token.expiresAt < now) return { isValid: false };

        const elapsedMinutes = (now.getTime() - token.createdAt.getTime()) / (1000 * 60);

        let estat = 'present';
        if (elapsedMinutes >= token.absentMinutes) {
            estat = 'absent';
        } else if (elapsedMinutes >= token.lateMinutes) {
            estat = 'retard';
        }

        return { isValid: true, estat };
    }

    async registerManualAttendance(alumneId: number, modulId: number, estat: string) {
        const avui = new Date().toISOString().split('T')[0];
        const hora = new Date().toTimeString().split(' ')[0];

        let assistencia = await this.assistenciaRepository.findOne({
            where: { alumne_id: alumneId, modul_id: modulId, data: avui }
        });

        if (assistencia) {
            assistencia.estat = estat as any;
            assistencia.hora = hora;
        } else {
            assistencia = this.assistenciaRepository.create({
                alumne_id: alumneId,
                modul_id: modulId,
                data: avui,
                hora: hora,
                estat: estat as any
            });
        }

        return await this.assistenciaRepository.save(assistencia);
    }
}
