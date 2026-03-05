import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';
import * as bcrypt from 'bcryptjs';

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

    async crearUsuari(dades: Partial<Usuari> & { contrasenya?: string }): Promise<Usuari> {
        const passwordPlana = dades.contrasenya || 'password123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(passwordPlana, salt);

        const nouUsuari = this.usuarisRepository.create({
            ...dades,
            contrasenyaHash: hash,
            esActiu: dades.esActiu !== undefined ? dades.esActiu : true
        });

        return this.usuarisRepository.save(nouUsuari);
    }

    async actualitzarUsuari(id: number, dades: Partial<Usuari> & { contrasenya?: string }): Promise<Usuari> {
        const usuari = await this.usuarisRepository.findOne({ where: { id } });
        if (!usuari) throw new NotFoundException('Usuari no trobat');

        if (dades.contrasenya) {
            const salt = await bcrypt.genSalt(10);
            usuari.contrasenyaHash = await bcrypt.hash(dades.contrasenya, salt);
            delete dades.contrasenya;
        }

        Object.assign(usuari, dades);
        return this.usuarisRepository.save(usuari);
    }

    async eliminarUsuari(id: number): Promise<void> {
        const queryRunner = this.usuarisRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            const resultat = await queryRunner.manager.delete(Usuari, id);
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
            await queryRunner.commitTransaction();

            if (resultat.affected === 0) {
                throw new NotFoundException('Usuari no trobat per eliminar');
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
            throw error;
        } finally {
            await queryRunner.release();
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

    async importarDadesProcess(file: any) {
        // Exemple d'endpoint d'importació basat en Multer
        const bytes = file?.size || 0;
        return {
            missatge: 'Fitxer rebut i processat correctament',
            alumnesImportats: 45,
            actualitzats: 12,
            mida: bytes
        };
    }

    async exportarGoogleSheets(): Promise<string> {
        // Mock de generació CSV per a descarregar
        const línies = [
            'ID,NOM,COGNOMS,CURS,FALTES,DATA_ULTIMA_CONNEXIO',
            '1,Marc,Garcia,DAW2,12,2025-10-14 08:00:00',
            '2,Laura,Martínez,ASIX1,4,2025-10-14 08:05:00',
            '3,Joan,Puig,SMX2,0,2025-10-14 07:55:00'
        ];
        return línies.join('\n');
    }

    // --- FASE 2 ---

    async obtenirEstatLectors() {
        // Retorna l'estat mock dinàmic dels lectors IoT
        const flutuacioBat = Math.floor(Math.random() * 5); // +0% a +4%
        return [
            { id: 1, aula: 'A12 (Informàtica)', estat: 'online', bateria: `${80 + flutuacioBat}%`, ultimaConnexio: new Date() },
            { id: 2, aula: 'B04 (Laboratori)', estat: 'offline', bateria: '0%', ultimaConnexio: new Date(Date.now() - 86400000) },
            { id: 3, aula: 'Gimnàs', estat: 'online', bateria: `${95 + flutuacioBat}%`, ultimaConnexio: new Date() }
        ];
    }

    async obtenirUsuarisActiusAra() {
        // Variabilitat simulada
        const variancia = Math.floor(Math.random() * 10000);
        return [
            { id: 10, nom: 'Marc', cognoms: 'Garcia', rol: 'alumne', ubicacio: 'A12 (Informàtica)', horaEntrada: new Date(Date.now() - 3600000 + variancia) },
            { id: 15, nom: 'Laura', cognoms: 'Martínez', rol: 'alumne', ubicacio: 'A12 (Informàtica)', horaEntrada: new Date(Date.now() - 3500000 + variancia) },
            { id: 2, nom: 'Joan', cognoms: 'Professor', rol: 'professor', ubicacio: 'B04 (Laboratori)', horaEntrada: new Date(Date.now() - 7200000 + variancia) }
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

    async afegirRecurs(dades: any) {
        // Mock per afegir recurs i retornar ID incrementat simuladament.
        return {
            id: Math.floor(Math.random() * 100) + 4,
            ...dades,
            estat: 'operatiu'
        };
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

    async enviarMissatgeIA(missatge: string) {
        // Simulació de resposta d'un LLM com Gemini
        const respostesAutomatiques = [
            "D'acord, com a assistent d'ADSUM, registraré aquesta informació sobre l'alumne.",
            "Aquesta funcionalitat requereix que validis el teu rol en els paràmetres de sistema.",
            "Recorda que la meva instrucció principal és centrar-me únicament en l'educació i gestió de l'institut.",
            "He processat la teva petició d'acord amb el protocol establert."
        ];

        let resposta = respostesAutomatiques[Math.floor(Math.random() * respostesAutomatiques.length)];
        const texteSegur = missatge ? String(missatge).toLowerCase() : '';

        if (texteSegur.includes('hola') || texteSegur.includes('bon dia')) {
            resposta = "Hola! Sóc l'assistent d'Avaluació i Gestió Escolar potenciat per IA. Com et puc ajudar avui?";
        }

        return {
            resposta: resposta,
            timestamp: new Date()
        };
    }

    async tancarCursRestaurarRGPD(confirmacioStr: string) {
        if (confirmacioStr !== 'CONFIRMAR') {
            throw new Error('Confirmació de seguretat incorrecta.');
        }
        // Procediment de purga fictici
        return { missatge: 'Procés de canvi de curs executat.' };
    }
}
