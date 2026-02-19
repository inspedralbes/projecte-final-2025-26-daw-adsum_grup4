import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from '../entities/nota.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Nota)
        private notesRepository: Repository<Nota>,
    ) { }

    async getAlumneNotes(id: number): Promise<any[]> {
        const notes = await this.notesRepository.find({
            where: { alumne_id: id },
            relations: ['modul'],
            order: { data_registre: 'DESC' },
        });

        if (!notes) return [];

        return notes.map(n => ({
            id: n.id_nota,
            modul: n.modul.nom,
            codi: n.modul.codi,
            nota: Number(n.valor),
            comentari: n.comentari,
            data: n.data_registre,
        }));
    }

    async getMitjana(id: number): Promise<number> {
        const result = await this.notesRepository
            .createQueryBuilder('nota')
            .select('AVG(nota.valor)', 'avg')
            .where('nota.alumne_id = :id', { id })
            .getRawOne();

        return result.avg ? Number(Number(result.avg).toFixed(2)) : 0;
    }
}
