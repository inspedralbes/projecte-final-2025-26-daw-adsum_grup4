import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assistencia, AssistenciaEstat, MetodeValidacio } from '../entities/assistencia.entity';
import { Sessio, SessioEstat } from '../entities/sessio.entity';
import { Usuari } from '../entities/usuari.entity';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { AttendanceGateway } from './attendance.gateway';
import { NotificacionsService } from '../notifications/notifications.service';
import { LogsService } from '../logs/logs.service';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let mockAssistenciaRepo: any;
  let mockSessioRepo: any;
  let mockUsuariRepo: any;
  let mockTokenRepo: any;
  let mockGateway: any;
  let mockNotificacionsService: any;
  let mockLogsService: any;

  beforeEach(async () => {
    mockAssistenciaRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    mockSessioRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUsuariRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    mockTokenRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockGateway = {
      notifyAttendance: jest.fn(),
    };

    mockNotificacionsService = {
      enviarNotificacioFamilia: jest.fn().mockResolvedValue(undefined),
    };

    mockLogsService = {
      warn: jest.fn(),
      attendanceRegistered: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Assistencia),
          useValue: mockAssistenciaRepo,
        },
        {
          provide: getRepositoryToken(Sessio),
          useValue: mockSessioRepo,
        },
        {
          provide: getRepositoryToken(Usuari),
          useValue: mockUsuariRepo,
        },
        {
          provide: getRepositoryToken(AttendanceToken),
          useValue: mockTokenRepo,
        },
        {
          provide: AttendanceGateway,
          useValue: mockGateway,
        },
        {
          provide: NotificacionsService,
          useValue: mockNotificacionsService,
        },
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should return token object with expiration when modulId and professorId provided', async () => {
      mockTokenRepo.save.mockResolvedValue({
        id: 1,
        token: '123456',
        expiresAt: new Date(),
        isUsed: false,
      });

      const result = await service.generateToken(1, 1, 15, 30);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
    });

    it('should return token string with in-memory expiry when no params provided', async () => {
      const result = await service.generateToken();

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
    });
  });

  describe('validateToken', () => {
    it('should return valid result for valid token from DB', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      mockTokenRepo.findOne.mockResolvedValue({
        id: 1,
        token: '123456',
        expiresAt: futureDate,
        createdAt: new Date(),
        lateMinutes: 15,
        absentMinutes: 30,
      });

      const result = await service.validateToken('123456');

      expect(result.isValid).toBe(true);
    });

    it('should return invalid for expired token from DB', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      mockTokenRepo.findOne.mockResolvedValue({
        id: 1,
        token: '123456',
        expiresAt: pastDate,
      });

      const result = await service.validateToken('123456');

      expect(result.isValid).toBe(false);
    });

    it('should return valid for in-memory token', async () => {
      const result = await service.generateToken();

      const validation = await service.validateToken(result.token);

      expect(validation.isValid).toBe(true);
    });

    it('should return invalid for non-existent token', async () => {
      mockTokenRepo.findOne.mockResolvedValue(null);

      const result = await service.validateToken('non-existent');

      expect(result.isValid).toBe(false);
    });
  });

  describe('registrarAssistencia', () => {
    it('should throw BadRequestException when token is invalid', async () => {
      mockTokenRepo.findOne.mockResolvedValue(null);

      await expect(
        service.registrarAssistencia(1, 'invalid-token'),
      ).rejects.toThrow();
    });

    it('should throw NotFoundException when student not found', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      mockTokenRepo.findOne.mockResolvedValue({
        id: 1,
        token: '123456',
        expiresAt: futureDate,
        createdAt: new Date(),
        lateMinutes: 15,
        absentMinutes: 30,
      });
      mockUsuariRepo.findOne.mockResolvedValue(null);

      await expect(
        service.registrarAssistencia(999, '123456'),
      ).rejects.toThrow();
    });

    it('should throw BadRequestException when student has no group', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      mockTokenRepo.findOne.mockResolvedValue({
        id: 1,
        token: '123456',
        expiresAt: futureDate,
        createdAt: new Date(),
        lateMinutes: 15,
        absentMinutes: 30,
      });
      mockUsuariRepo.findOne.mockResolvedValue({
        id: 1,
        nom: 'Test',
        grup: null,
      });

      await expect(
        service.registrarAssistencia(1, '123456'),
      ).rejects.toThrow();
    });

    it('should register attendance when all validations pass', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      mockTokenRepo.findOne.mockResolvedValue({
        id: 1,
        token: '123456',
        expiresAt: futureDate,
        createdAt: new Date(),
        lateMinutes: 15,
        absentMinutes: 30,
      });
      mockUsuariRepo.findOne.mockResolvedValue({
        id: 1,
        nom: 'Test Alumne',
        grup: { id: 1 },
      });
      mockSessioRepo.findOne.mockResolvedValue({
        id: 1,
        estat: SessioEstat.ACTIVA,
        assignacioDocent: { assignaturaId: 1, grup: { id: 1 } },
      });
      mockAssistenciaRepo.findOne.mockResolvedValue(null);
      mockAssistenciaRepo.create.mockReturnValue({
        alumneId: 1,
        modulId: 1,
        estat: AssistenciaEstat.PRESENT,
      });
      mockAssistenciaRepo.save.mockResolvedValue({
        id: 1,
        alumneId: 1,
        modulId: 1,
        estat: AssistenciaEstat.PRESENT,
      });

      const result = await service.registrarAssistencia(1, '123456');

      expect(result.success).toBe(true);
    });

    it('should validate token from in-memory store', async () => {
      const tokenResult = await service.generateToken();

      const validation = await service.validateToken(tokenResult.token);

      expect(validation.isValid).toBe(true);
    });
  });
});