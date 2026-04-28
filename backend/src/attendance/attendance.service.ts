/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as crypto from 'crypto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  Inject,
  forwardRef,
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
import { v4 as uuidv4 } from 'uuid';
import { AttendanceGateway } from './attendance.gateway';
import { LogsService } from '../logs/logs.service';

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
    @Inject(LogsService)
    private readonly logger: LogsService,
  ) {}

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

  private readonly TOKEN_EXPIRED_ERROR = 'TOKEN_EXPIRED';
  private readonly TOKEN_INVALID_ERROR = 'TOKEN_INVALID';
  private readonly NO_ACTIVE_SESSION_ERROR = 'NO_ACTIVE_SESSION';
  private readonly DUPLICATE_ATTENDANCE_ERROR = 'DUPLICATE_ATTENDANCE';
  private readonly INVALID_SESSION_FOR_TOKEN_ERROR =
    'INVALID_SESSION_FOR_TOKEN';

  async validateToken(tokenValue: string): Promise<{
    isValid: boolean;
    estat?: string;
    error?: string;
    modulId?: number;
    expiresAt?: Date;
  }> {
    const now = new Date();

    let tokenData: {
      expiresAt: Date;
      modulId: number;
      lateMinutes: number;
      absentMinutes: number;
      createdAt: Date;
    } | null = null;

    const dbToken = await this.tokenRepository.findOne({
      where: { token: tokenValue },
    });

    if (dbToken) {
      if (dbToken.expiresAt < now) {
        return {
          isValid: false,
          error: this.TOKEN_EXPIRED_ERROR,
          expiresAt: dbToken.expiresAt,
        };
      }
      if (dbToken.isUsed) {
        return { isValid: false, error: this.TOKEN_INVALID_ERROR };
      }
      tokenData = {
        expiresAt: dbToken.expiresAt,
        modulId: dbToken.modulId,
        lateMinutes: dbToken.lateMinutes,
        absentMinutes: dbToken.absentMinutes,
        createdAt: dbToken.createdAt,
      };
    } else {
      const expiry = this.activeTokens.get(tokenValue);
      if (!expiry || expiry <= now) {
        return { isValid: false, error: this.TOKEN_EXPIRED_ERROR };
      }
      tokenData = {
        expiresAt: expiry,
        modulId: 0,
        lateMinutes: 15,
        absentMinutes: 30,
        createdAt: new Date(0),
      };
    }

    const elapsedMinutes =
      (now.getTime() - tokenData.createdAt.getTime()) / (1000 * 60);

    let estat = 'present';
    if (elapsedMinutes >= tokenData.absentMinutes) {
      estat = 'absent';
    } else if (elapsedMinutes >= tokenData.lateMinutes) {
      estat = 'retard';
    }

    return {
      isValid: true,
      estat,
      modulId: tokenData.modulId,
      expiresAt: tokenData.expiresAt,
    };
  }

  async validateTokenSession(
    tokenValue: string,
    modulId: number,
  ): Promise<boolean> {
    const validation = await this.validateToken(tokenValue);
    if (!validation.isValid || !validation.modulId) {
      return false;
    }
    return validation.modulId === modulId;
  }

  async registrarAssistencia(alumneId: number, tokenValue: string) {
    const validation = await this.validateToken(tokenValue);
    if (!validation.isValid) {
      if (validation.error === this.TOKEN_EXPIRED_ERROR) {
        this.logger.warn('Token QR expirat', 'AttendanceService', {
          event: 'TOKEN_EXPIRED',
          alumneId,
          token: tokenValue.slice(0, 8) + '…',
        });
        throw new UnauthorizedException({
          code: 'TOKEN_EXPIRED',
          message: 'El token ha expirat',
          expiresAt: validation.expiresAt,
        });
      }
      this.logger.warn('Token QR invàlid o ja utilitzat', 'AttendanceService', {
        event: 'TOKEN_INVALID',
        alumneId,
        token: tokenValue.slice(0, 8) + '…',
      });
      throw new BadRequestException({
        code: 'TOKEN_INVALID',
        message: 'Token invàlid o ja ha estat usat',
      });
    }

    const alumneQuery = await this.usuariRepo.findOne({
      where: { id: alumneId },
      relations: ['grup'],
    });
    if (!alumneQuery) {
      throw new NotFoundException({
        code: 'STUDENT_NOT_FOUND',
        message: 'Alumne no trobat',
      });
    }
    if (!alumneQuery.grup) {
      throw new BadRequestException({
        code: 'NO_GROUP_ASSIGNED',
        message: "L'alumne no té grup assignat",
      });
    }

    const sessio = await this.sessioRepo.findOne({
      where: {
        estat: SessioEstat.ACTIVA,
        assignacioDocent: { grup: { id: alumneQuery.grup.id } },
      },
      relations: ['assignacioDocent', 'assignacioDocent.grup'],
    });

    if (!sessio) {
      this.logger.warn('No hi ha sessió activa per al grup', 'AttendanceService', {
        event: 'NO_ACTIVE_SESSION',
        alumneId,
        grupId: alumneQuery.grup.id,
      });
      throw new BadRequestException({
        code: this.NO_ACTIVE_SESSION_ERROR,
        message: 'No hi ha cap sessió activa per al teu grup ara mateix',
      });
    }

    if (
      validation.modulId &&
      sessio.assignacioDocent.assignaturaId !== validation.modulId
    ) {
      this.logger.warn('Token no pertany a la sessió activa', 'AttendanceService', {
        event: 'INVALID_SESSION_FOR_TOKEN',
        alumneId,
        sessioId: sessio.id,
        tokenModulId: validation.modulId,
        sessioModulId: sessio.assignacioDocent.assignaturaId,
      });
      throw new BadRequestException({
        code: this.INVALID_SESSION_FOR_TOKEN_ERROR,
        message: 'El token no pertany a aquesta sessió',
      });
    }

    const assistenciaExistent = await this.assistenciaRepo.findOne({
      where: {
        sessio: { id: sessio.id },
        alumne: { id: alumneQuery.id },
      },
    });

    if (assistenciaExistent) {
      this.logger.warn('Intent de doble registre d'Assistencia', 'AttendanceService', {
        event: 'DUPLICATE_ATTENDANCE',
        alumneId,
        sessioId: sessio.id,
      });
      throw new ConflictException({
        code: this.DUPLICATE_ATTENDANCE_ERROR,
        message: "Ja has registrat l'assistència prèviament",
        assistencia: assistenciaExistent,
      });
    }

    // Determinar l'estat a partir de la validació del token
    const estatValidat: AssistenciaEstat =
      (validator.estat as AssistenciaEstat) ?? AssistenciaEstat.PRESENT;

    const assistencia = this.assistenciaRepo.create({
      sessio: Sessio,
      alumne: alumneQuery,
      estat: estatValidat,
      metodeValidacio: MetodeValidacio.QR_MOBIL,
    });

    await this.assistenciaRepo.save(Assistencia);

    // Marcar el token de BD com a usat per evitar reutilitzacions
    const dbToken = await this.tokenRepository.findOne({
      where: { token: tokenValue },
    });
    if (dbToken) {
      dbToken.isUsed = true;
      await this.tokenRepository.save(dbToken);
    }

    this.logger.attendanceRegistered(alumneId, Sessio.id, Assistencia.estat);

    this.attendanceGateway.notifyAttendance(
      Sessio.assignacioDocent.assignaturaId || 0,
      {
        alumneId: alumneQuery.id,
        nom: alumneQuery.nom,
        estat: assistencia.estat,
        data: assistencia.dataRegistre,
      },
    );

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

    const result = await this.assistenciaRepo.save(assistencia);

    // Notificar al profesor en tiempo real
    this.attendanceGateway.notifyAttendance(modulId, {
      alumneId: alumneId,
      estat: estat,
      data: assistencia.dataRegistre,
    });

    return result;
  }
}
