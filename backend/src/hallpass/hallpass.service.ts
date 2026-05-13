import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SortidaAula, MotiuSortida } from '../entities/sortida-aula.entity';

@Injectable()
export class HallpassService {
  constructor(
    @InjectRepository(SortidaAula)
    private sortidaRepo: Repository<SortidaAula>,
  ) {}

  async crearSortida(
    alumneId: number,
    motiu: MotiuSortida,
    duradaMinuts: number = 15,
  ) {
    const sortida = this.sortidaRepo.create({
      alumneId,
      motiu,
      duradaMinuts,
      sessioId: 1,
    });
    return await this.sortidaRepo.save(sortida);
  }

  async getSortidesAlumne(alumneId: number) {
    return await this.sortidaRepo.find({
      where: { alumneId },
      order: { horaSortida: 'DESC' },
      take: 20,
    });
  }

  async registrarTornada(sortidaId: number) {
    const sortida = await this.sortidaRepo.findOne({
      where: { id: sortidaId },
    });
    if (!sortida) {
      throw new NotFoundException('Sortida no trobada');
    }
    sortida.horaTornada = new Date();
    return await this.sortidaRepo.save(sortida);
  }

  async getSortidesActives() {
    return await this.sortidaRepo.find({
      where: { horaTornada: undefined as any },
      order: { horaSortida: 'DESC' },
    });
  }
}