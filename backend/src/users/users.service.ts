import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Usuari, UserRole } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';
import { Modul } from '../entities/modul.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Usuari)
        private readonly usuariRepository: Repository<Usuari>,
        @InjectRepository(Assistencia)
        private readonly assistenciaRepository: Repository<Assistencia>,
        @InjectRepository(Modul)
        private readonly modulRepository: Repository<Modul>,
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

    async getProfessorModuls(id: number) {
        return await this.modulRepository.find({
            where: { professor_id: id },
            relations: ['grup'],
        });
    }

    async getModulStudents(modulId: number) {
        const modul = await this.modulRepository.findOne({
            where: { id_modul: modulId },
            relations: ['grup'],
        });

        if (!modul) return null;

        // Buscar alumnes del grup del mòdul
        const alumnes = await this.usuariRepository.find({
            where: { grup_id: modul.grup_id, rol: UserRole.ALUMNE },
            order: { nom: 'ASC' },
        });

        // Obtenir tota l'assistència de l'històric per a aquests alumnes
        const totHistorial = await this.assistenciaRepository.find({
            where: { alumne_id: In(alumnes.map(a => a.id_usuari)) }
        });

        const avui = new Date().toISOString().split('T')[0];

        return alumnes.map(alumne => {
            const historialAlumne = totHistorial.filter(h => h.alumne_id === alumne.id_usuari);
            const assistenciaAvui = historialAlumne.find(h => h.modul_id === modulId && h.data === avui);

            return {
                id: alumne.id_usuari,
                nom: alumne.nom,
                email: alumne.email,
                foto: alumne.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alumne.nom}`,
                telefon: alumne.telefon || '600 000 000',
                estat: assistenciaAvui ? assistenciaAvui.estat : 'pendent',
                faltas_acumuladas: historialAlumne.filter(h => h.estat === 'absent').length,
                retrasos_acumulados: historialAlumne.filter(h => h.estat === 'retard').length
            };
        });
    }

    async seedStudents(modulId: number) {
        const modul = await this.modulRepository.findOne({
            where: { id_modul: modulId },
            relations: ['grup'],
        });

        if (!modul || !modul.grup_id) return { success: false, message: 'Module or Group not found' };

        const currentStudents = await this.usuariRepository.count({
            where: { grup_id: modul.grup_id, rol: UserRole.ALUMNE },
        });

        if (currentStudents >= 20) {
            return { success: true, message: `Already has ${currentStudents} students` };
        }

        const names = [
            'Marc Roig', 'Laia Sols', 'Pol Vila', 'Anna Bosch', 'Joan Martí',
            'Carla Puig', 'Miquel Serra', 'Elena Roca', 'Jordi Font', 'Sílvia Mas',
            'Albert Soler', 'Marta Vidal', 'Pau Casals', 'Núria Riera', 'Roger Molins',
            'Laura Gallart', 'Oriol Rovira', 'Clara Valls', 'Xavier Bosch', 'Irene Solà',
            'Bernat Figueras', 'Marina Prats'
        ];

        const newStudents: Usuari[] = [];
        for (let i = currentStudents; i < 22; i++) {
            const name = names[i % names.length] + (i > names.length ? ` ${i}` : '');
            const email = `student${i}@example.com`;

            const student = this.usuariRepository.create({
                nom: name,
                email: email,
                password_hash: 'hashed_password', // Mock password
                rol: UserRole.ALUMNE,
                grup_id: modul.grup_id,
                foto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                telefon: `600 ${100 + i} ${200 + i}`,
            });
            newStudents.push(student);
        }

        await this.usuariRepository.save(newStudents);
        return { success: true, message: `Added ${newStudents.length} students` };
    }
}
