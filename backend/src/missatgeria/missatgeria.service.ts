import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Missatge } from '../entities/missatge.entity';
import { Usuari, UserRole } from '../entities/usuari.entity';

@Injectable()
export class MissatgeriaService {
  constructor(
    @InjectRepository(Missatge)
    private readonly missatgeRepository: Repository<Missatge>,
    @InjectRepository(Usuari)
    private readonly usuariRepository: Repository<Usuari>,
  ) {}

  async enviarMissatge(emissorId: number, receptorId: number, contingut: string): Promise<Missatge> {
    const emissor = await this.usuariRepository.findOne({ where: { id: emissorId } });
    const receptor = await this.usuariRepository.findOne({ where: { id: receptorId } });

    if (!emissor || !receptor) {
      throw new NotFoundException('Usuari no trobat');
    }

    const nouMissatge = this.missatgeRepository.create({
      emissorId,
      receptorId,
      contingut,
    });

    return await this.missatgeRepository.save(nouMissatge);
  }

  async obtenirConversa(usuari1Id: number, usuari2Id: number): Promise<Missatge[]> {
    return await this.missatgeRepository.find({
      where: [
        { emissorId: usuari1Id, receptorId: usuari2Id },
        { emissorId: usuari2Id, receptorId: usuari1Id },
      ],
      order: {
        dataEnviament: 'ASC',
      },
      relations: ['emissor', 'receptor'],
    });
  }

  async obtenirFamiliarsDAlumne(alumneId: number): Promise<Usuari[]> {
    const alumne = await this.usuariRepository.findOne({
      where: { id: alumneId },
      relations: ['tutors'],
    });

    if (!alumne) {
      throw new NotFoundException('Alumne no trobat');
    }

    return alumne.tutors;
  }
  
  async obtenirAlumnesDeFamiliar(familiarId: number): Promise<Usuari[]> {
     const familiar = await this.usuariRepository.findOne({
      where: { id: familiarId },
      relations: ['fills'],
    });

    if (!familiar) {
      throw new NotFoundException('Familiar no trobat');
    }

    return familiar.fills;
  }
}
