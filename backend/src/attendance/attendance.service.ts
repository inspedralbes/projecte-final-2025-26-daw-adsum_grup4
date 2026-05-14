import * as crypto from 'crypto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
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
  ) { }

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
      relations: ['assignacioDocent', 'assignacioDocent.grup'],
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

    // Notificar al profesor en tiempo real
    this.attendanceGateway.notifyAttendance(sessio.assignacioDocent.assignaturaId || 0, {
      alumneId: alumneQuery.id,
      nom: alumneQuery.nom,
      estat: assistencia.estat,
      data: assistencia.dataRegistre
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

    const result = await this.assistenciaRepo.save(assistencia);

    // Notificar al profesor en tiempo real
    this.attendanceGateway.notifyAttendance(modulId, {
      alumneId: alumneId,
      estat: estat,
      data: assistencia.dataRegistre
    });

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
