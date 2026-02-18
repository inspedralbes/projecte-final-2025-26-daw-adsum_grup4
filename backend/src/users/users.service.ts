import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Usuari)
        private readonly usuariRepository: Repository<Usuari>,
        @InjectRepository(Assistencia)
        private readonly assistenciaRepository: Repository<Assistencia>,
    ) { }

    async getAlumneStats(id: number) {
        // Obtenir dades de l'alumne
        const alumne = await this.usuariRepository.findOne({
            where: { id_usuari: id },
            relations: ['grup'],
        });

        if (!alumne) return null;

        // Obtenir totes les assistències de l'alumne
        const assistencies = await this.assistenciaRepository.find({
            where: { alumne_id: id },
            relations: ['modul'],
            order: { data: 'DESC' },
        });

        const total = assistencies.length;
        const presents = assistencies.filter(a => a.estat === 'present' || a.estat === 'justificat').length;
        const absents = assistencies.filter(a => a.estat === 'absent').length;
        const retards = assistencies.filter(a => a.estat === 'retard').length;
        const percentatge = total > 0 ? Math.round((presents / total) * 100) : 0;

        // Calcular racha actual (dies consecutius presents)
        let ratxa = 0;
        const sorted = [...assistencies].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        for (const a of sorted) {
            if (a.estat === 'present') ratxa++;
            else break;
        }

        // Últimes 10 assistències per mostrar al frontend
        const recents = assistencies.slice(0, 10).map(a => ({
            data: a.data,
            hora: a.hora,
            modul: a.modul?.nom ?? 'Desconegut',
            estat: a.estat,
        }));

        return {
            nom: alumne.nom,
            email: alumne.email,
            grup: alumne.grup?.nom ?? '',
            curs: alumne.grup?.curs_academic ?? '',
            stats: {
                total,
                presents,
                absents,
                retards,
                percentatge,
                ratxa,
            },
            recents,
        };
    }
}
