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
import { Repository, Raw, IsNull } from 'typeorm';
import {
  Assistencia,
  AssistenciaEstat,
  MetodeValidacio,
} from '../entities/assistencia.entity';
import { Sessio, SessioEstat } from '../entities/sessio.entity';
import { Usuari } from '../entities/usuari.entity';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { SortidaAula, MotiuSortida } from '../entities/sortida-aula.entity';
import { v4 as uuidv4 } from 'uuid';
import { AttendanceGateway } from './attendance.gateway';
import { LogsService } from '../logs/logs.service';
import { NotificacionsService } from '../notifications/notifications.service';

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
    @InjectRepository(SortidaAula)
    private readonly sortidaRepo: Repository<SortidaAula>,
    @Inject(forwardRef(() => AttendanceGateway))
    private readonly attendanceGateway: AttendanceGateway,
    private readonly logsService: LogsService,
    private readonly notificacionsService: NotificacionsService,
  ) {}

  async generateToken(
    modulId?: number,
    professorId?: number,
    lateMinutes: number = 15,
    absentMinutes: number = 30,
  ): Promise<AttendanceToken | { token: string; expiresAt: Date }> {
    if (modulId && professorId) {
      // 1. Asegurar que existe una sesión activa para este profesor y módulo
      // Buscamos la asignación docente
      const assignacio = await this.assistenciaRepo.manager.getRepository('AssignacioDocent').findOne({
        where: { professorId: professorId, assignaturaId: modulId }
      });

      if (assignacio) {
        let sessio = await this.sessioRepo.findOne({
          where: { assignacioDocentId: (assignacio as any).id, estat: SessioEstat.ACTIVA }
        });

        if (!sessio) {
          sessio = this.sessioRepo.create({
            assignacioDocentId: (assignacio as any).id,
            estat: SessioEstat.ACTIVA,
            dataInici: new Date()
          });
          await this.sessioRepo.save(sessio);
        }
      }

      // 2. Generar el token (PIN de 6 dígitos)
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

      const savedToken = await this.tokenRepository.save(newToken);
      
      // Notificar a todos los alumnos del módulo vía WebSockets
      this.attendanceGateway.broadcastNewToken(modulId, savedToken.token);

      return savedToken;
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
        this.logsService.warn('Token QR expirat', 'AttendanceService', {
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
      this.logsService.warn(
        'Token QR invàlid o ja utilitzat',
        'AttendanceService',
        {
          event: 'TOKEN_INVALID',
          alumneId,
          token: tokenValue.slice(0, 8) + '…',
        },
      );
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
      this.logsService.warn(
        'No hi ha sessió activa per al grup',
        'AttendanceService',
        {
          event: 'NO_ACTIVE_SESSION',
          alumneId,
          grupId: alumneQuery.grup.id,
        },
      );
      throw new BadRequestException({
        code: this.NO_ACTIVE_SESSION_ERROR,
        message: 'No hi ha cap sessió activa per al teu grup ara mateix',
      });
    }

    if (
      validation.modulId &&
      sessio.assignacioDocent.assignaturaId !== validation.modulId
    ) {
      this.logsService.warn(
        'Token no pertany a la sessió activa',
        'AttendanceService',
        {
          event: 'INVALID_SESSION_FOR_TOKEN',
          alumneId,
          sessioId: sessio.id,
          tokenModulId: validation.modulId,
          sessioModulId: sessio.assignacioDocent.assignaturaId,
        },
      );
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
      this.logsService.warn(
        "Intent de doble registre d'Assistencia",
        'AttendanceService',
        {
          event: 'DUPLICATE_ATTENDANCE',
          alumneId,
          sessioId: sessio.id,
        },
      );
      throw new ConflictException({
        code: this.DUPLICATE_ATTENDANCE_ERROR,
        message: "Ja has registrat l'assistència prèviament",
        assistencia: assistenciaExistent,
      });
    }

    // Determinar l'estat a partir de la validació del token
    const estatValidat: AssistenciaEstat =
      (validation.estat as AssistenciaEstat) ?? AssistenciaEstat.PRESENT;

    const assistencia = this.assistenciaRepo.create({
      sessio: sessio,
      alumne: alumneQuery,
      estat: estatValidat,
      metodeValidacio: MetodeValidacio.QR_MOBIL,
    });

    await this.assistenciaRepo.save(assistencia);

    // Marcar el token de BD com a usat per evitar reutilitzacions
    const dbToken = await this.tokenRepository.findOne({
      where: { token: tokenValue },
    });
    if (dbToken) {
      dbToken.isUsed = true;
      await this.tokenRepository.save(dbToken);
    }

    this.logsService.attendanceRegistered(
      alumneId,
      sessio.id,
      assistencia.estat,
    );

    this.attendanceGateway.notifyAttendance(
      sessio.assignacioDocent.assignaturaId || 0,
      {
        alumneId: alumneQuery.id,
        nom: alumneQuery.nom,
        estat: assistencia.estat,
        data: assistencia.dataRegistre,
      },
    );

    // Notificar als pares si l'alumne no ha arribat o ha sortit abans d'hora
    if (assistencia.estat === AssistenciaEstat.ABSENT || assistencia.estat === AssistenciaEstat.JUSTIFICAT) {
      const now = new Date();
      const horaClasse = now.getHours();
      
      if (horaClasse < 10) {
        await this.notificacionsService.enviarNotificacioFamilia(
          [alumneQuery],
          '📚 Adsum - Absència',
          `El/La ${alumneQuery.nom} no ha arrivat a classe aquest matí.`,
          { alumneId: alumneQuery.id, tipus: 'absencia', data: now }
        );
      } else {
        await this.notificacionsService.enviarNotificacioFamilia(
          [alumneQuery],
          '📚 Adsum - Sortida anticipada',
          `El/La ${alumneQuery.nom} ha sortit de classe abans d'hora.`,
          { alumneId: alumneQuery.id, tipus: 'sortida_anticipada', data: now }
        );
      }
    }

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
        alumne: { id: alumneId },
        dataRegistre: Raw((alias) => `DATE(${alias}) = :avui`, { avui }),
      },
      relations: ['alumne'],
    });

    if (assistencia) {
      assistencia.estat = estat as any;
    } else {
      const alumne = await this.usuariRepo.findOne({ where: { id: alumneId } });
      if (!alumne) {
        throw new NotFoundException('Alumne no trobat');
      }
      assistencia = this.assistenciaRepo.create({
        alumne: alumne,
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

    // Notificar als pares si el professor marca com absent
    if (estat === 'ABSENT') {
      const alumne = await this.usuariRepo.findOne({ where: { id: alumneId } });
      if (alumne) {
        await this.notificacionsService.enviarNotificacioFamilia(
          [alumne],
          '📚 Adsum - Absència registrada',
          `El/La ${alumne.nom} ha estat marcat/da com absent pel professor.`,
          { alumneId: alumneId, tipus: 'absencia_manual', data: new Date() }
        );
      }
    }

    return result;
  }

  async registrarSortida(alumneId: number, motiu: MotiuSortida) {
    // 1. Buscar sessió activa per l'alumne
    const alumne = await this.usuariRepo.findOne({ where: { id: alumneId }, relations: ['grup'] });
    if (!alumne || !alumne.grup) throw new NotFoundException('Alumne o grup no trobat');

    const sessio = await this.sessioRepo.findOne({
      where: { estat: SessioEstat.ACTIVA, assignacioDocent: { grup: { id: alumne.grup.id } } },
      relations: ['assignacioDocent']
    });

    if (!sessio) throw new BadRequestException('No hi ha cap sessió activa ara mateix');

    // 2. Crear registre de sortida
    const sortida = this.sortidaRepo.create({
      sessioId: sessio.id,
      alumneId: alumne.id,
      // Nota: motiu es podria guardar en una columna extra si cal, 
      // però segons l'entitat actual només tenim les hores.
      // Afegiré el motiu com a comentari o en un camp nou si l'entitat ho permet.
    });

    const guardada = await this.sortidaRepo.save(sortida);

    // 3. Notificar al professor
    this.attendanceGateway.notifyHallPass(sessio.assignacioDocent.assignaturaId, {
      alumneId: alumne.id,
      nom: alumne.nom,
      motiu: motiu,
      hora: guardada.horaSortida
    });

    return guardada;
  }

  async registrarTornada(alumneId: number) {
    const sortida = await this.sortidaRepo.findOne({
      where: { alumneId: alumneId, horaTornada: IsNull() },
      order: { horaSortida: 'DESC' }
    });

    if (!sortida) throw new NotFoundException('No tens cap sortida pendent');

    sortida.horaTornada = new Date();
    return await this.sortidaRepo.save(sortida);
  }
}
