import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recurs } from '../entities/recurs.entity';
import * as path from 'path';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Recurs)
    private resourcesRepository: Repository<Recurs>,
  ) {}

  async obtenirTots(): Promise<Recurs[]> {
    return this.resourcesRepository.find({
      relations: ['modul', 'autor'],
      order: { dataPujada: 'DESC' },
    });
  }

  async obtenirPerId(id: number): Promise<Recurs> {
    const recurs = await this.resourcesRepository.findOne({ where: { id } });
    if (!recurs) throw new NotFoundException('Recurs no trobat');
    return recurs;
  }

  getRutaFitxer(nomFitxer: string): string {
    // Retornem la ruta absoluta del fitxer dins de la carpeta uploads
    return path.join(process.cwd(), 'uploads', 'recursos', nomFitxer);
  }
}
