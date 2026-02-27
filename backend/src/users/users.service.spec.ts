import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Usuari, UserRole } from '../entities/usuari.entity';
import { Assistencia, AssistenciaEstat } from '../entities/assistencia.entity';
import { Modul } from '../entities/modul.entity';

const mockUsuariRepo = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});
const mockAssistenciaRepo = () => ({
    find: jest.fn(),
});
const mockModulRepo = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
});

describe('UsersService', () => {
    let service: UsersService;
    let usuariRepo: any;
    let assistenciaRepo: any;
    let modulRepo: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(Usuari), useFactory: mockUsuariRepo },
                { provide: getRepositoryToken(Assistencia), useFactory: mockAssistenciaRepo },
                { provide: getRepositoryToken(Modul), useFactory: mockModulRepo },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        usuariRepo = module.get(getRepositoryToken(Usuari));
        assistenciaRepo = module.get(getRepositoryToken(Assistencia));
        modulRepo = module.get(getRepositoryToken(Modul));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getModulStudents', () => {
        it('should return null if module not found', async () => {
            modulRepo.findOne.mockResolvedValue(null);
            const result = await service.getModulStudents(999);
            expect(result).toBeNull();
        });

        it('should return students with pendent status when no attendance today', async () => {
            const fakeModul = { id_modul: 1, grup_id: 1 };
            const fakeStudents = [
                { id: 1, nom: 'Marc Roig', email: 'marc@test.com', fotoUrl: null, telefon: null },
                { id: 2, nom: 'Laia Sols', email: 'laia@test.com', fotoUrl: null, telefon: null },
            ];

            modulRepo.findOne.mockResolvedValue(fakeModul);
            usuariRepo.find.mockResolvedValue(fakeStudents);
            assistenciaRepo.find.mockResolvedValue([]); // No attendance today

            const result = await service.getModulStudents(1);

            expect(result).toHaveLength(2);
            expect(result[0].estat).toBe('pendent');
            expect(result[1].estat).toBe('pendent');
            expect(result[0].faltas_acumuladas).toBe(0);
        });

        it('should reflect today attendance status correctly', async () => {
            const today = new Date().toISOString().split('T')[0];
            const fakeModul = { id_modul: 1, grup_id: 1 };
            const fakeStudents = [{ id: 10, nom: 'Test Student', email: 'test@test.com', fotoUrl: null, telefon: null }];
            const fakeAttendance = [
                { alumne: { id: 10 }, modulId: 1, dataRegistre: today, estat: 'present' },
            ];

            modulRepo.findOne.mockResolvedValue(fakeModul);
            usuariRepo.find.mockResolvedValue(fakeStudents);
            assistenciaRepo.find.mockResolvedValue(fakeAttendance);

            const result = await service.getModulStudents(1);

            expect(result[0].estat).toBe('present');
        });

        it('should count cumulative absences and lates', async () => {
            const today = new Date().toISOString().split('T')[0];
            const fakeModul = { id_modul: 1, grup_id: 1 };
            const fakeStudents = [{ id: 5, nom: 'Anna Bosch', email: 'anna@test.com', fotoUrl: null, telefon: null }];
            const history = [
                { alumne: { id: 5 }, modulId: 1, dataRegistre: '2025-01-01', estat: 'absent' },
                { alumne: { id: 5 }, modulId: 1, dataRegistre: '2025-01-02', estat: 'absent' },
                { alumne: { id: 5 }, modulId: 1, dataRegistre: '2025-01-03', estat: 'retard' },
            ];

            modulRepo.findOne.mockResolvedValue(fakeModul);
            usuariRepo.find.mockResolvedValue(fakeStudents);
            assistenciaRepo.find.mockResolvedValue(history);

            const result = await service.getModulStudents(1);
            expect(result).not.toBeNull();
            if (!result) return;

            expect(result[0].faltas_acumuladas).toBe(2);
            expect(result[0].retrasos_acumulados).toBe(1);
        });
    });

    describe('getProfessorModuls', () => {
        it('should return list of modules for a professor', async () => {
            const fakeModuls = [{ id_modul: 1, nom: 'DAW' }, { id_modul: 2, nom: 'DAM' }];
            modulRepo.find.mockResolvedValue(fakeModuls);
            const result = await service.getProfessorModuls(1);
            expect(result).toHaveLength(2);
        });
    });
});
