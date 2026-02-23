import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Dispositiu } from '../entities/dispositiu.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuari, Dispositiu])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
