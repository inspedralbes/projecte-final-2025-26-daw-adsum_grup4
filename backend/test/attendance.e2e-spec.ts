/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Usuari, UserRole } from '../src/entities/usuari.entity';
import { Grup } from '../src/entities/grup.entity';
import { Sessio, SessioEstat } from '../src/entities/sessio.entity';
import { AttendanceToken } from '../src/entities/attendance-token.entity';
import { AssignacioDocent } from '../src/entities/assignacio-docent.entity';
import { Assignatura } from '../src/entities/assignatura.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SeedService } from '../src/seed/seed.service';

describe('AttendanceController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let testAlumne: Usuari;
  let validTokenValue: string;

  beforeAll(async () => {
    process.env.DB_TYPE = 'sqlite';
    process.env.DB_NAME = ':memory:';
    process.env.JWT_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SeedService)
      .useValue({ onApplicationBootstrap: () => {} })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);

    // 1. Create Group
    const grupRepo = dataSource.getRepository(Grup);
    const grup = await grupRepo.save({
      codi: 'DAW2',
      nom: 'Desenvolupament Aplicacions Web 2',
      cursAcademic: '2025-2026',
    });

    // 2. Create Assignatura
    const assignaturaRepo = dataSource.getRepository(Assignatura);
    const assignatura = await assignaturaRepo.save({
      nom: 'Projecte Final',
      codi: 'PRJ',
    });

    // 3. Create Alumne
    const userRepo = dataSource.getRepository(Usuari);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    testAlumne = await userRepo.save({
      nom: 'Alumne',
      cognoms: 'Test',
      email: 'alumne@example.com',
      contrasenyaHash: hashedPassword,
      rol: UserRole.ALUMNE,
      grup: grup,
      esActiu: true,
    });

    // 4. Create Professor
    const professor = await userRepo.save({
      nom: 'Professor',
      cognoms: 'Test',
      email: 'prof@example.com',
      contrasenyaHash: hashedPassword,
      rol: UserRole.PROFESSOR,
      esActiu: true,
    });

    // 5. Create AssignacioDocent
    const assignacioRepo = dataSource.getRepository(AssignacioDocent);
    const assignacio = await assignacioRepo.save({
      professor: professor,
      grup: grup,
      assignatura: assignatura,
    });

    // 6. Create Active Session
    const sessioRepo = dataSource.getRepository(Sessio);
    await sessioRepo.save({
      assignacioDocent: assignacio,
      estat: SessioEstat.ACTIVA,
      dataSessio: new Date(),
      horaInici: '08:00',
      horaFi: '10:00',
    });

    // 7. Create Attendance Token
    const tokenRepo = dataSource.getRepository(AttendanceToken);
    const token = await tokenRepo.save({
      token: '123456',
      modulId: 1,
      professorId: professor.id,
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      lateMinutes: 15,
      absentMinutes: 30,
      isUsed: false,
    });
    validTokenValue = token.token;

    // Login to get access token
    const loginRes = await request(app.getHttpServer() as unknown as any)
      .post('/auth/login')
      .send({
        email: 'alumne@example.com',
        contrasenya: 'password123',
      });

    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    if (dataSource) await dataSource.destroy();
    if (app) await app.close();
  });

  it('/attendance/validate (POST) - valid token', async () => {
    const response = await request(app.getHttpServer() as unknown as any)
      .post('/attendance/validate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        token: validTokenValue,
        alumneId: testAlumne.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Assistència registrada correctament');
  });

  it('/attendance/validate (POST) - invalid token', async () => {
    return request(app.getHttpServer() as unknown as any)
      .post('/attendance/validate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        token: 'wrongtoken',
        alumneId: testAlumne.id,
      })
      .expect(400);
  });

  it('/attendance/validate (POST) - duplicate attendance', async () => {
    const response = await request(app.getHttpServer() as unknown as any)
      .post('/attendance/validate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        token: validTokenValue,
        alumneId: testAlumne.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Ja havies registrat');
  });
});
