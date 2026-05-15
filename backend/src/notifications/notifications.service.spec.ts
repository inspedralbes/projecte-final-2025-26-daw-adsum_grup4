/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SubscripcioPush } from '../entities/subscripcio-push.entity';
import { Usuari, UserRole } from '../entities/usuari.entity';
import { DataSource } from 'typeorm';

describe('NotificacionsService', () => {
  let service: NotificacionsService;
  let mockRepository: any;
  let mockConfigService: any;
  let mockDataSource: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          VAPID_PUBLIC_KEY:
            'BAYpv9NMlZYady-ke2W-h4Zlcf0sn0hCVPWotImSKHnmo8BWPzCJJbI3ZUtV2-Sx3nInjqfzYAb-BzYw2gFuN7U',
          VAPID_PRIVATE_KEY: 'IkJ7-GJfmox9Lza5wZzbQx-8zxr7dVsFe6ewasS-be8',
          VAPID_SUBJECT: 'mailto:admin@adsum.edu',
        };
        return config[key];
      }),
    };

    mockDataSource = {
      manager: {
        findOne: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacionsService,
        {
          provide: getRepositoryToken(SubscripcioPush),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<NotificacionsService>(NotificacionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscriure', () => {
    it('should create a new subscription when it does not exist', async () => {
      const mockUser = { id: 1, nom: 'Test User' } as unknown as Usuari;
      const mockSubscription = {
        endpoint: 'test-endpoint',
        keys: { p256dh: 'test', auth: 'test' },
      };
      const userAgent = 'Mozilla/5.0';

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({
        usuari: mockUser,
        tokenSubscripcio: JSON.stringify(mockSubscription),
        agentUsuari: userAgent,
      });
      mockRepository.save.mockResolvedValue(true);

      const result = await service.subscriure(
        mockUser,
        mockSubscription,
        userAgent,
      );

      expect(result.missatge).toBe('Subscripció guardada correctament');
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return existing subscription message when subscription exists', async () => {
      const mockUser = { id: 1, nom: 'Test User' } as unknown as Usuari;
      const mockSubscription = { endpoint: 'test-endpoint' };

      mockRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.subscriure(
        mockUser,
        mockSubscription,
        'Mozilla',
      );

      expect(result.missatge).toBe('Subscripció ja existent');
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getVapidPublicKey', () => {
    it('should return the VAPID public key', () => {
      const publicKey = service.getVapidPublicKey();
      expect(publicKey).toBe(
        'BAYpv9NMlZYady-ke2W-h4Zlcf0sn0hCVPWotImSKHnmo8BWPzCJJbI3ZUtV2-Sx3nInjqfzYAb-BzYw2gFuN7U',
      );
    });

    it('should return empty string when no key configured', () => {
      mockConfigService.get.mockReturnValue(null);
      const publicKey = service.getVapidPublicKey();
      expect(publicKey).toBe('');
    });
  });

  describe('enviarNotificacioFamilia', () => {
    it('should not send notifications when no tutors found', async () => {
      const mockAlumne = { id: 1, nom: 'Alumne Test' } as unknown as Usuari;

      mockDataSource.manager.findOne.mockResolvedValue({
        id: 1,
        nom: 'Alumne Test',
        tutors: [],
      });

      await service.enviarNotificacioFamilia(
        [mockAlumne],
        'Test Title',
        'Test Body',
      );

      expect(mockRepository.find).not.toHaveBeenCalled();
    });

    it('should send notifications to tutors with push subscriptions', async () => {
      const mockAlumne = { id: 1, nom: 'Alumne Test' } as unknown as Usuari;
      const mockTutor = { id: 2, nom: 'Tutor Test', rol: UserRole.FAMILIA };
      const mockSubscription = {
        endpoint: 'https://test.push.service/send',
        keys: { p256dh: 'test', auth: 'test' },
      };

      mockDataSource.manager.findOne.mockResolvedValue({
        id: 1,
        nom: 'Alumne Test',
        tutors: [mockTutor],
      });

      mockRepository.find.mockResolvedValue([
        {
          id: 1,
          usuariId: 2,
          tokenSubscripcio: JSON.stringify(mockSubscription),
        },
      ]);

      const webpush = require('web-push');
      jest.spyOn(webpush, 'sendNotification').mockResolvedValue(true);

      await service.enviarNotificacioFamilia(
        [mockAlumne],
        'Test Title',
        'Test Body',
        { testData: true },
      );

      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
