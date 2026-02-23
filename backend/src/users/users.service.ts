import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuari)
    private usersRepository: Repository<Usuari>,
  ) { }

  async findByEmail(email: string): Promise<Usuari | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
