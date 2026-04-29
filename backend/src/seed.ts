import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    const result = await seedService.executarSeed();
    console.log('Seed completed:', result);
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
