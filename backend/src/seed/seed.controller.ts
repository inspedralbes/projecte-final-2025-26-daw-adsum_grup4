import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('api/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('executar')
  async executarSeed() {
    return await this.seedService.executarSeed();
  }

  @Get('status')
  async getStatus() {
    return await this.seedService.getStatus();
  }
}
