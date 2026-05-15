import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Espai } from '../entities/espai.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Espai)
    private readonly espaiRepo: Repository<Espai>,
  ) {}

  async llistarEspais() {
    return await this.espaiRepo.find();
  }

  async llistarReservesUsuari(usuariId: number) {
    return await this.reservaRepo.find({
      where: { usuariId },
      relations: ['espai'],
      order: { data: 'ASC', franja: 'ASC' },
    });
  }

  async crearReserva(usuariId: number, dades: { espaiId: number, data: string, franja: string }) {
    // Verificar si ja existeix una reserva per a aquest espai, data i franja
    const existent = await this.reservaRepo.findOne({
      where: { espaiId: dades.espaiId, data: dades.data, franja: dades.franja }
    });

    if (existent) throw new BadRequestException('Aquest espai ja està reservat en aquesta franja horària');

    const nova = this.reservaRepo.create({
      usuariId,
      ...dades
    });

    return await this.reservaRepo.save(nova);
  }

  async cancel·larReserva(id: number, usuariId: number) {
    const reserva = await this.reservaRepo.findOne({ where: { id, usuariId } });
    if (!reserva) throw new NotFoundException('Reserva no trobada');
    
    return await this.reservaRepo.remove(reserva);
  }
}
