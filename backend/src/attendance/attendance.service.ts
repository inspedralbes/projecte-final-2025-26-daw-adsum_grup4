import * as crypto from 'crypto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import {
  Assistencia,
  AssistenciaEstat,
  MetodeValidacio,
} from '../entities/assistencia.entity';
import { Sessio, SessioEstat } from '../entities/sessio.entity';
import { Usuari } from '../entities/usuari.entity';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { AttendanceGateway } from './attendance.gateway';
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
    @InjectRepository(AttendanceToken)
    private readonly tokenRepository: Repository<AttendanceToken>,
    @Inject(forwardRef(() => AttendanceGateway))
    private readonly attendanceGateway: AttendanceGateway,
  ) { }

  async generateToken(
    modulId?: number,
    professorId?: number,
    lateMinutes: number = 15,
    absentMinutes: number = 30,
  ): Promise<AttendanceToken | { token: string; expiresAt: Date }> {
    if (modulId && professorId) {
      // Logic from feature branch: persistence in DB
      const tokenValue = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2);

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
    } else {
      // Logic from HEAD: legacy uuid token in memory
      const tokenValue = uuidv4();
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + 3600);

      this.activeTokens.set(tokenValue, expiresAt);
      return { token: tokenValue, expiresAt };
    }
  }

  async validateToken(
    tokenValue: string,
  ): Promise<{ isValid: boolean; estat?: string }> {
    // Check DB first
    const token = await this.tokenRepository.findOne({
      where: { token: tokenValue },
    });

    if (token) {
      const now = new Date();
      if (token.expiresAt < now) return { isValid: false };

      const elapsedMinutes =
        (now.getTime() - token.createdAt.getTime()) / (1000 * 60);

      let estat = 'present';
      if (elapsedMinutes >= token.absentMinutes) {
        estat = 'absent';
      } else if (elapsedMinutes >= token.lateMinutes) {
        estat = 'retard';
      }

      return { isValid: true, estat };
    }

    // Check memory
    const expiry = this.activeTokens.get(tokenValue);
    const isValid = !!expiry && expiry > new Date();
    return { isValid, estat: isValid ? 'present' : undefined };
  }

  async registrarAssistencia(alumneId: number, tokenValue: string) {
    // 1. Validar Token
    const validation = await this.validateToken(tokenValue);
    if (!validation.isValid) {
      throw new BadRequestException('Token invàlid o expirat');
    }

    // 2. Trobar Alumne
    const alumneQuery = await this.usuariRepo.findOne({
      where: { id: alumneId },
      relations: ['grup'],
    });
    if (!alumneQuery) throw new NotFoundException('Alumne no trobat');
    if (!alumneQuery.grup)
      throw new BadRequestException("L'alumne no té grup assignat");

    // 3. Trobar Sessió Activa pel Grup de l'Alumne
    const sessio = await this.sessioRepo.findOne({
      where: {
        estat: SessioEstat.ACTIVA,
        assignacioDocent: { grup: { id: alumneQuery.grup.id } },
      },
      relations: ['assignacioDocent', 'assignacioDocent.grup', 'assignacioDocent.assignatura'],
    });

    if (!sessio) {
      throw new NotFoundException(
        'No hi ha cap sessió activa per al teu grup ara mateix',
      );
    }

    // 4. Comprovar si ja ha fitxat
    const assistenciaExistent = await this.assistenciaRepo.findOne({
      where: {
        sessio: { id: sessio.id },
        alumne: { id: alumneQuery.id },
      },
    });

    if (assistenciaExistent) {
      return {
        success: true,
        message: "Ja havies registrat l'assistència prèviament",
        assistencia: assistenciaExistent,
      };
    }

    // 5. Crear Assistència
    const assistencia = this.assistenciaRepo.create({
      sessio: sessio,
      alumne: alumneQuery,
      estat: (validation.estat as any) || AssistenciaEstat.PRESENT,
      metodeValidacio: MetodeValidacio.QR_MOBIL,
    });

    await this.assistenciaRepo.save(assistencia);

    this.attendanceGateway.emitStudentJoined(sessio.assignacioDocent.assignatura.id, {
      id: assistencia.id,
      estat: assistencia.estat,
      dataRegistre: assistencia.dataRegistre,
      alumne: {
        id: alumneQuery.id,
        nom: alumneQuery.nom,
        cognoms: alumneQuery.cognoms,
      }
    });

    return {
      success: true,
      message: 'Assistència registrada correctament',
      assistencia,
    };
  }

  async registerManualAttendance(
    alumneId: number,
    modulId: number,
    estat: string,
  ) {
    const avui = new Date().toISOString().split('T')[0];

    let assistencia = await this.assistenciaRepo.findOne({
      where: {
        alumneId: alumneId,
        modulId: modulId,
        dataRegistre: Raw((alias) => `DATE(${alias}) = :avui`, { avui }),
      },
    });

    if (assistencia) {
      assistencia.estat = estat as any;
    } else {
      assistencia = this.assistenciaRepo.create({
        alumneId,
        modulId,
        estat: estat as any,
        metodeValidacio: MetodeValidacio.PROFESSOR_MANUAL,
      });
    }

    return await this.assistenciaRepo.save(assistencia);
  }
}
