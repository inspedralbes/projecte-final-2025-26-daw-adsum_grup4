import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grup } from '../entities/grup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grup])],
  controllers: [],
  providers: [],
})
export class GroupsModule {}
