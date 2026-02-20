import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceToken } from '../entities/attendance-token.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Repository } from 'typeorm';

const mockTokenRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
});

const mockAssistenciaRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('AttendanceService', () => {
    let service: AttendanceService;
    let tokenRepo: jest.Mocked<Repository<AttendanceToken>>;
    let assistenciaRepo: jest.Mocked<Repository<Assistencia>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AttendanceService,
                { provide: getRepositoryToken(AttendanceToken), useFactory: mockTokenRepository },
                { provide: getRepositoryToken(Assistencia), useFactory: mockAssistenciaRepository },
            ],
        }).compile();

        service = module.get<AttendanceService>(AttendanceService);
        tokenRepo = module.get(getRepositoryToken(AttendanceToken));
        assistenciaRepo = module.get(getRepositoryToken(Assistencia));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', () => {
        it('should generate a 6-digit token and save it', async () => {
            const mockToken = { token: '123456', modulId: 1 };
            tokenRepo.create.mockReturnValue(mockToken as any);
            tokenRepo.save.mockResolvedValue(mockToken as any);

            const result = await service.generateToken(1, 1, 15, 30);

            expect(tokenRepo.create).toHaveBeenCalled();
            expect(tokenRepo.save).toHaveBeenCalled();
            expect(result).toEqual(mockToken);
        });
    });

    describe('validateToken', () => {
        it('should return isValid=false for unknown token', async () => {
            tokenRepo.findOne.mockResolvedValue(null);
            const result = await service.validateToken('bad-token');
            expect(result.isValid).toBe(false);
        });

        it('should return isValid=false for expired token', async () => {
            const expiredToken = {
                token: '123456',
                expiresAt: new Date(Date.now() - 10000),
                createdAt: new Date(Date.now() - 60000),
                lateMinutes: 15,
                absentMinutes: 30,
            };
            tokenRepo.findOne.mockResolvedValue(expiredToken as any);
            const result = await service.validateToken('123456');
            expect(result.isValid).toBe(false);
        });

        it('should return present status for valid fresh token', async () => {
            const freshToken = {
                token: '123456',
                expiresAt: new Date(Date.now() + 60000 * 60),
                createdAt: new Date(),
                lateMinutes: 15,
                absentMinutes: 30,
            };
            tokenRepo.findOne.mockResolvedValue(freshToken as any);
            const result = await service.validateToken('123456');
            expect(result.isValid).toBe(true);
            expect(result.estat).toBe('present');
        });
    });

    describe('registerManualAttendance', () => {
        it('should update existing attendance record', async () => {
            const existing = { id_assistencia: 1, estat: 'pendent', hora: '09:00:00' };
            assistenciaRepo.findOne.mockResolvedValue(existing as any);
            assistenciaRepo.save.mockResolvedValue({ ...existing, estat: 'present' } as any);

            const result = await service.registerManualAttendance(1, 1, 'present');

            expect(assistenciaRepo.findOne).toHaveBeenCalled();
            expect(assistenciaRepo.save).toHaveBeenCalled();
        });

        it('should create new attendance record if none exists', async () => {
            assistenciaRepo.findOne.mockResolvedValue(null);
            const newRecord = { id_assistencia: 99, estat: 'absent' };
            assistenciaRepo.create.mockReturnValue(newRecord as any);
            assistenciaRepo.save.mockResolvedValue(newRecord as any);

            await service.registerManualAttendance(1, 1, 'absent');

            expect(assistenciaRepo.create).toHaveBeenCalled();
            expect(assistenciaRepo.save).toHaveBeenCalled();
        });
    });
});
