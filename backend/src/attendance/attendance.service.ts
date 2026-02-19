import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assistencia, AssistenciaEstat, MetodeValidacio } from '../entities/assistencia.entity';
import { Sessio, SessioEstat } from '../entities/sessio.entity';
import { Usuari } from '../entities/usuari.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttendanceService {
    private activeTokens = new Map<string, Date>();

    constructor(
        @InjectRepository(Assistencia)
        private assistenciaRepo: Repository<Assistencia>,
        @InjectRepository(Sessio)
        private sessioRepo: Repository<Sessio>,
        @InjectRepository(Usuari)
        private usuariRepo: Repository<Usuari>,
    ) { }

    async generateToken(): Promise<{ token: string, expiresAt: Date }> {
        const tokenValue = uuidv4();
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 3600); // 1h per test

        this.activeTokens.set(tokenValue, expiresAt);

        // Neteja de tokens expirats (simple)
        if (this.activeTokens.size > 100) {
            const now = new Date();
            for (const [t, exp] of this.activeTokens.entries()) {
                if (exp < now) this.activeTokens.delete(t);
            }
        }

        return {
            token: tokenValue,
            expiresAt: expiresAt,
        };
    }

    async registrarAssistencia(alumneId: number, token: string) {
        // 1. Validar Token
        if (!this.activeTokens.has(token)) {
            throw new BadRequestException('Token invàlid o expirat');
        }
        const expiresAt = this.activeTokens.get(token);
        if (!expiresAt || expiresAt < new Date()) {
            this.activeTokens.delete(token);
            throw new BadRequestException('Token expirat');
        }

        // 2. Trobar Alumne
        const alumneQuery = await this.usuariRepo.findOne({ where: { id: alumneId }, relations: ['grup'] });
        if (!alumneQuery) throw new NotFoundException('Alumne no trobat');
        if (!alumneQuery.grup) throw new BadRequestException('L\'alumne no té grup assignat');

        // 3. Trobar Sessió Activa pel Grup de l'Alumne
        const sessio = await this.sessioRepo.findOne({
            where: {
                estat: SessioEstat.ACTIVA,
                assignacioDocent: { grup: { id: alumneQuery.grup.id } }
            },
            relations: ['assignacioDocent', 'assignacioDocent.grup']
        });

        if (!sessio) {
            throw new NotFoundException('No hi ha cap sessió activa per al teu grup ara mateix');
        }

        // 4. Comprovar si ja ha fitxat
        const assistenciaExistent = await this.assistenciaRepo.findOne({
            where: {
                sessio: { id: sessio.id },
                alumne: { id: alumneQuery.id }
            }
        });

        if (assistenciaExistent) {
            return {
                success: true,
                message: 'Ja havies registrat l\'assistència prèviament',
                assistencia: assistenciaExistent
            };
        }

        // 5. Crear Assistència
        const assistencia = this.assistenciaRepo.create({
            sessio: sessio,
            alumne: alumneQuery,
            estat: AssistenciaEstat.PRESENT,
            metodeValidacio: MetodeValidacio.QR_MOBIL,
            // dataRegistre s'autocompleta
        });

        await this.assistenciaRepo.save(assistencia);

        return {
            success: true,
            message: 'Assistència registrada correctament',
            assistencia
        };
    }

    async validateToken(tokenValue: string): Promise<boolean> {
        const expiry = this.activeTokens.get(tokenValue);
        return !!expiry && expiry > new Date();
    }
}
