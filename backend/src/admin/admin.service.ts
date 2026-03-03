import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Usuari)
        private usuarisRepository: Repository<Usuari>,
        @InjectRepository(Assistencia)
        private assistenciaRepository: Repository<Assistencia>,
    ) { }

    async obtenirUsuaris(): Promise<Usuari[]> {
        return this.usuarisRepository.find({
            select: ['id', 'nom', 'cognoms', 'email', 'dniNie', 'rol', 'esActiu', 'dataCreacio'],
            order: { rol: 'ASC', cognoms: 'ASC' },
        });
    }

    async actualitzarUsuari(id: number, dades: Partial<Usuari>): Promise<Usuari> {
        const usuari = await this.usuarisRepository.findOne({ where: { id } });
        if (!usuari) throw new NotFoundException('Usuari no trobat');

        Object.assign(usuari, dades);
        return this.usuarisRepository.save(usuari);
    }

    async eliminarUsuari(id: number): Promise<void> {
        const resultat = await this.usuarisRepository.delete(id);
        if (resultat.affected === 0) {
            throw new NotFoundException('Usuari no trobat per eliminar');
        }
    }

    async getAnaliticaAbsentisme() {
        // Retornem dades simulades (mock) per ara, ja que es requereixen per al panell visual de l'admin
        // En una iteració futura, es pot calcular en base a la taula 'assistencia'
        return {
            totalAbsenciesIda: 145,
            tendencia: '+5% respecte la setmana passada',
            horesCritiques: ['Mòdul 1 (08:00)', 'Mòdul 4 (11:30)'],
            grupsRisc: [
                { nom: 'DAW2', faltes: 45 },
                { nom: 'ASIX1', faltes: 38 },
                { nom: 'SMX2', faltes: 30 }
            ],
            alumnesAlerta: [
                { id: 10, nom: 'Marc', cognoms: 'García', faltesRecents: 5, curs: 'DAW2' },
                { id: 15, nom: 'Laura', cognoms: 'Martínez', faltesRecents: 4, curs: 'ASIX1' },
            ]
        };
    }

    async importarDadesProcess(files: any) {
        // Exemple d'endpoint d'importació
        return {
            missatge: 'Fitxer rebut i processat correctament',
            alumnesImportats: 45,
            actualitzats: 12
        };
    }

    // --- FASE 2 ---

    async obtenirEstatLectors() {
        // Retorna l'estat mock dels lectors IoT ubicats a les portes de les aules
        return [
            { id: 1, aula: 'A12 (Informàtica)', estat: 'online', bateria: '80%', ultimaConnexio: new Date() },
            { id: 2, aula: 'B04 (Laboratori)', estat: 'offline', bateria: '0%', ultimaConnexio: new Date(Date.now() - 86400000) },
            { id: 3, aula: 'Gimnàs', estat: 'online', bateria: '100%', ultimaConnexio: new Date() }
        ];
    }

    async obtenirRecursos() {
        return [
            { id: 1, nom: 'Carretó Portàtils A', tipus: 'Maquinari', estat: 'operatiu' },
            { id: 2, nom: 'Aula Audiovisuals', tipus: 'Espai', estat: 'manteniment' },
            { id: 3, nom: 'Laboratori Química', tipus: 'Espai', estat: 'operatiu' }
        ];
    }

    async canviarEstatRecurs(id: number, estat: string) {
        // Mock per al canvi d'estat
        return { missatge: `L'estat del recurs ${id} ara és ${estat}` };
    }

    async getIAConfig() {
        // Configuració actual de Gemini per al chatbot
        return {
            estat: 'actiu',
            peticionsDiaries: 125,
            limitDiari: 1500,
            promptSistema: 'Ets un assistent escolar de l\'institut ADSUM. Respon de manera educada, clara i només en informació relativa a horaris i justificacions.',
            ultimError: null
        };
    }

    async actualitzarPromptIA(nouPrompt: string) {
        return { missatge: 'System prompt actualitzat', prompt: nouPrompt };
    }

    async tancarCursRestaurarRGPD(confirmacioStr: string) {
        if (confirmacioStr !== 'CONFIRMAR') {
            throw new Error('Confirmació de seguretat incorrecta.');
        }
        // Procediment de purga fictici
        return { missatge: 'Procés de canvi de curs executat.' };
    }
}
