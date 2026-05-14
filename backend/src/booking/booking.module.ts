import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Espai } from '../entities/espai.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Espai])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
