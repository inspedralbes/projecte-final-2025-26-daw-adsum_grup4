import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LogsService } from '../logs/logs.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockLogsService: any;

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: jest.fn(),
      guardarTokenRecuperacio: jest.fn(),
      trobarPerTokenRecuperacio: jest.fn(),
      actualitzarContrasenya: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('test-jwt-token'),
    };

    mockLogsService = {
      loginSuccess: jest.fn(),
      loginFailed: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        contrasenyaHash: await bcrypt.hash('password123', 10),
        nom: 'Test User',
        rol: 'alumne',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toHaveProperty('id');
      expect(result.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('contrasenyaHash');
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        contrasenyaHash: await bcrypt.hash('correctpassword', 10),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nom: 'Test User',
        rol: 'alumne',
        cognoms: 'Test',
        grup_id: 1,
      };

      const result = await service.login(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(1);
      expect(result.user.email).toBe('test@example.com');
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should call jwtService.sign with correct payload', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nom: 'Test',
        rol: 'professor',
        cognoms: 'User',
        grup_id: null,
      };

      await service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          sub: 1,
          rol: 'professor',
          nom: 'Test',
          cognoms: 'User',
        }),
      );
    });
  });

  describe('recuperarContrasenya', () => {
    it('should return message regardless of email existence', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.recuperarContrasenya('nonexistent@example.com');

      expect(result.missatge).toBe('Si el correu existeix, rebràs instruccions.');
    });

    it('should save recovery token when email exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.guardarTokenRecuperacio.mockResolvedValue(true);

      const result = await service.recuperarContrasenya('test@example.com');

      expect(mockUsersService.guardarTokenRecuperacio).toHaveBeenCalledWith(
        1,
        expect.any(String),
        expect.any(Date),
      );
      expect(result.missatge).toBe('Si el correu existeix, rebràs instruccions.');
    });
  });

  describe('restablirContrasenya', () => {
    it('should throw BadRequestException when token is invalid', async () => {
      mockUsersService.trobarPerTokenRecuperacio.mockResolvedValue(null);

      await expect(
        service.restablirContrasenya('invalid-token', 'newpassword123'),
      ).rejects.toThrow('Token invàlid o expirat');
    });

    it('should throw BadRequestException when token is expired', async () => {
      const mockUser = {
        id: 1,
       caducitatTokenRecuperacio: new Date(Date.now() - 3600000),
      };

      mockUsersService.trobarPerTokenRecuperacio.mockResolvedValue(mockUser);

      await expect(
        service.restablirContrasenya('valid-token', 'newpassword123'),
      ).rejects.toThrow('El token ha caducat');
    });

    it('should update password when token is valid', async () => {
      const mockUser = {
        id: 1,
        caducitatTokenRecuperacio: new Date(Date.now() + 3600000),
      };

      mockUsersService.trobarPerTokenRecuperacio.mockResolvedValue(mockUser);
      mockUsersService.actualitzarContrasenya.mockResolvedValue(true);

      const result = await service.restablirContrasenya('valid-token', 'newpassword123');

      expect(mockUsersService.actualitzarContrasenya).toHaveBeenCalledWith(
        1,
        expect.any(String),
      );
      expect(result.missatge).toBe('Contrasenya actualitzada correctament');
    });
  });
});