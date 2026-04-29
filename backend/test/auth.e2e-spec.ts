/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Usuari, UserRole } from '../src/entities/usuari.entity';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { SeedService } from '../src/seed/seed.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.DB_TYPE = 'sqlite';
    process.env.DB_NAME = ':memory:';
    process.env.JWT_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SeedService)
      .useValue({ onApplicationBootstrap: () => {} }) // Disable seeding
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);

    // Seed a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const userRepository = dataSource.getRepository(Usuari);
    await userRepository.save({
      nom: 'Test',
      cognoms: 'User',
      email: 'test@example.com',
      contrasenyaHash: hashedPassword,
      rol: UserRole.ALUMNE,
      esActiu: true,
    });
  });

  afterAll(async () => {
    if (dataSource) await dataSource.destroy();
    if (app) await app.close();
  });

  it('/auth/login (POST) - correct credentials', () => {
    return request(app.getHttpServer() as unknown as any)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        contrasenya: 'password123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
      });
  });

  it('/auth/login (POST) - incorrect credentials', () => {
    return request(app.getHttpServer() as unknown as any)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        contrasenya: 'wrongpassword',
      })
      .expect(401);
  });
});
