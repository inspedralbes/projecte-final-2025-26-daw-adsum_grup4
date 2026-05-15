import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Justificacio, JustificacioEstat } from '../entities/justificacio.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class JustificationsService {
  constructor(
    @InjectRepository(Justificacio)
    private readonly justificacioRepo: Repository<Justificacio>,
  ) {}

  async crear(dades: { alumneId: number, motiu: string, dataInici: string, dataFi: string, arxiuUrl?: string }) {
    const nova = this.justificacioRepo.create({
      ...dades,
      estat: JustificacioEstat.PENDENT,
    });
    return await this.justificacioRepo.save(nova);
  }

  async llistarPerAlumne(alumneId: number) {
    return await this.justificacioRepo.find({
      where: { alumneId },
      order: { dataSolicitud: 'DESC' },
    });
  }

  async llistarTotes() {
    return await this.justificacioRepo.find({
      relations: ['alumne'],
      order: { dataSolicitud: 'DESC' },
    });
  }

  async validar(id: number, estat: JustificacioEstat, observacions?: string) {
    const justificacio = await this.justificacioRepo.findOne({ where: { id } });
    if (!justificacio) throw new NotFoundException('Justificació no trobada');

    justificacio.estat = estat;
    if (observacions) justificacio.observacionsProfessor = observacions;

    return await this.justificacioRepo.save(justificacio);
  }

  getRutaArxiu(nomFitxer: string): string {
    return path.join(process.cwd(), 'uploads', 'justificacions', nomFitxer);
  }
}
