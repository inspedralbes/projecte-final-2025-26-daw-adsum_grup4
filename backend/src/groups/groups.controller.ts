import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grup } from '../entities/grup.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/grups')
export class GroupsController {
  constructor(
    @InjectRepository(Grup)
    private grupRepo: Repository<Grup>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllGroups() {
    return this.grupRepo.find({
      relations: ['alumnes'],
    });
  }
}