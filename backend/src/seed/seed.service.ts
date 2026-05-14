import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari, UserRole, NivellEducatiu } from '../entities/usuari.entity';
import { Grup } from '../entities/grup.entity';
import { Assignatura } from '../entities/assignatura.entity';
import { AssignacioDocent } from '../entities/assignacio-docent.entity';
import { Sessio, SessioEstat } from '../entities/sessio.entity';
import { ConfiguracioCentre } from '../entities/configuracio-centre.entity';
import { Modul } from '../entities/modul.entity';
import { Assistencia, AssistenciaEstat, MetodeValidacio } from '../entities/assistencia.entity';
import { Nota } from '../entities/nota.entity';
import { Missatge } from '../entities/missatge.entity';
import { Recurs } from '../entities/recurs.entity';
import { Justificacio, JustificacioEstat } from '../entities/justificacio.entity';

import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuari) private readonly usuariRepo: Repository<Usuari>,
    @InjectRepository(Grup) private readonly grupRepo: Repository<Grup>,
    @InjectRepository(Assignatura) private readonly assignaturaRepo: Repository<Assignatura>,
    @InjectRepository(AssignacioDocent) private readonly assignacioDocentRepo: Repository<AssignacioDocent>,
    @InjectRepository(Sessio) private readonly sessioRepo: Repository<Sessio>,
    @InjectRepository(ConfiguracioCentre) private readonly configuracioCentreRepo: Repository<ConfiguracioCentre>,
    @InjectRepository(Modul) private readonly modulRepo: Repository<Modul>,
    @InjectRepository(Assistencia) private readonly assistenciaRepo: Repository<Assistencia>,
    @InjectRepository(Nota) private readonly notaRepo: Repository<Nota>,
    @InjectRepository(Missatge) private readonly missatgeRepo: Repository<Missatge>,
    @InjectRepository(Recurs) private readonly recursRepo: Repository<Recurs>,
    @InjectRepository(Justificacio) private readonly justificacioRepo: Repository<Justificacio>,
  ) { }

  async onApplicationBootstrap() {
    // Verificació d'usuaris per defecte
  }

  async executarSeed() {
    try {
      console.log('[SEED] Iniciant procés de seeding massiu...');
      await this.esborrarTot();
      await this.crearConfiguracio();

      const dadesUsuaris = this.llegirJson('usuaris.json');
      const dadesAssignatures = this.llegirJson('assignatures.json');
      const dadesGrups = this.llegirJson('grups.json');

      const grupsMap = await this.crearGrups(dadesGrups);
      const admin = await this.crearAdmins(dadesUsuaris.admins);
      const professors = await this.crearProfessors(dadesUsuaris.professors);
      const moduls = await this.crearModuls(grupsMap, professors, dadesAssignatures);
      const alumnes = await this.crearAlumnes(grupsMap, dadesUsuaris.alumnes);

      console.log('[SEED] Generant dades històriques...');
      await this.generarDadesHistoriques(alumnes, moduls);
      
      console.log('[SEED] Creant recursos i missatges...');
      await this.crearRecursos(moduls, professors);
      await this.crearMissatges(alumnes);

      return {
        missatge: 'BASE DE DADES OMPLERTA AMB DADES REALS',
        dades: {
          usuaris: admin.length + professors.length + alumnes.length,
          grups: grupsMap.size,
          moduls: moduls.length,
          alumnes: alumnes.length,
          recursos: 4,
          missatges_inicials: 1
        },
      };
    } catch (error) {
      console.error(error);
      return { missatge: 'ERROR EN SEEDING', error: error.message };
    }
  }

  private llegirJson(nomFitxer: string) {
    const ruta = path.join(process.cwd(), 'dist', 'seed', 'data', nomFitxer);
    const data = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(data);
  }

  private async esborrarTot() {
    await this.notaRepo.query('SET FOREIGN_KEY_CHECKS = 0');
    await this.missatgeRepo.clear();
    await this.recursRepo.clear();
    await this.notaRepo.clear();
    await this.assistenciaRepo.clear();
    await this.sessioRepo.clear();
    await this.assignacioDocentRepo.clear();
    await this.modulRepo.clear();
    await this.assignaturaRepo.clear();
    await this.usuariRepo.clear();
    await this.grupRepo.clear();
    await this.configuracioCentreRepo.clear();
    await this.notaRepo.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  private async crearConfiguracio() {
    const config = this.configuracioCentreRepo.create({
      id: 1, minutsTallRetard: 10, minutsTallAbsencia: 15, cursActual: '2025-2026'
    });
    await this.configuracioCentreRepo.save(config);
  }

  private async crearGrups(grupsData: any[]) {
    const grupsMap = new Map<string, Grup>();
    for (const g of grupsData) {
      const grup = this.grupRepo.create({
        codi: g.codi, nom: g.nom, aulaBase: g.aula_base, cursAcademic: '2025-2026'
      });
      grupsMap.set(g.codi, await this.grupRepo.save(grup));
    }
    return grupsMap;
  }

  private async crearAdmins(adminsData: any[]) {
    const salt = await bcrypt.genSalt(10);
    const admins: Usuari[] = [];
    for (const d of adminsData) {
      const user = this.usuariRepo.create({
        nom: d.nom, cognoms: d.cognoms, email: d.email, rol: UserRole.ADMIN, esActiu: true,
        contrasenyaHash: await bcrypt.hash(d.contrasenya, salt)
      });
      admins.push(await this.usuariRepo.save(user));
    }
    return admins;
  }

  private async crearProfessors(profesData: any[]) {
    const salt = await bcrypt.genSalt(10);
    const profes: Usuari[] = [];
    for (const d of profesData) {
      const user = this.usuariRepo.create({
        nom: d.nom, cognoms: d.cognoms, email: d.email, rol: UserRole.PROFESSOR, esActiu: true,
        departament: d.departament, contrasenyaHash: await bcrypt.hash(d.contrasenya, salt)
      });
      profes.push(await this.usuariRepo.save(user));
    }
    return profes;
  }

  private async crearModuls(grupsMap: Map<string, Grup>, professors: Usuari[], assignaturesData: any[]) {
    const moduls: Modul[] = [];
    for (const ass of assignaturesData) {
      const professor = professors.find(p => `${p.nom} ${p.cognoms}` === ass.professor) || professors[0];
      for (const [codi, grup] of grupsMap) {
        if (ass.codi.includes('DAW') && codi.includes('DAM')) continue;
        if (ass.codi.includes('DAM') && codi.includes('DAW')) continue;

        const modul = this.modulRepo.create({
          nom: ass.nom, codi: ass.codi, professor, grup
        });
        moduls.push(await this.modulRepo.save(modul));
      }
    }
    return moduls;
  }

  private async crearAlumnes(grupsMap: Map<string, Grup>, alumnesData: any[]) {
    const salt = await bcrypt.genSalt(10);
    const alumnes: Usuari[] = [];
    for (const d of alumnesData) {
      const grup = grupsMap.get(d.grup_codi);
      const user = this.usuariRepo.create({
        nom: d.nom, cognoms: d.cognoms, email: d.email, rol: UserRole.ALUMNE, esActiu: true,
        grup, contrasenyaHash: await bcrypt.hash(d.contrasenya, salt)
      });
      alumnes.push(await this.usuariRepo.save(user));
    }
    return alumnes;
  }

  private async generarDadesHistoriques(alumnes: Usuari[], moduls: Modul[]) {
    for (const alumne of alumnes) {
      const grupId = alumne.grup?.id;
      if (!grupId) continue;

      const modulsAlumne = moduls.filter(m => m.grup.id === grupId);
      
      for (const modul of modulsAlumne) {
        const numNotes = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numNotes; i++) {
          const nota = this.notaRepo.create({
            alumne, modul, valor: parseFloat((Math.random() * 5 + 5).toFixed(1)),
            comentari: i === 0 ? 'Examen UF1' : 'Projecte Pràctic'
          });
          await this.notaRepo.save(nota);
        }

        for (let d = 0; d < 20; d++) {
          const random = Math.random();
          let estat = AssistenciaEstat.PRESENT;
          if (random > 0.95) estat = AssistenciaEstat.ABSENT;
          else if (random > 0.85) estat = AssistenciaEstat.RETARD;

          const data = new Date();
          data.setDate(data.getDate() - d);

          const assistencia = this.assistenciaRepo.create({
            alumne, modul, estat, dataRegistre: data,
            metodeValidacio: MetodeValidacio.QR_MOBIL
          });
          await this.assistenciaRepo.save(assistencia);
        }
      }
    }
  }

  private async crearRecursos(moduls: Modul[], professors: Usuari[]) {
    const recursos = [
      { titol: 'Resum UF1: Objectes', nomFitxer: 'resum_uf1_objectes.pdf', mida: '2.4 MB', icona: 'file', color: 'bg-blue-500 shadow-blue-200' },
      { titol: 'Projecte Final: Guia', nomFitxer: 'guia_projecte.pdf', mida: '1.1 MB', icona: 'file', color: 'bg-emerald-500 shadow-emerald-200' },
      { titol: 'Apunts Accessibilitat', nomFitxer: 'accessibilitat.pdf', mida: '5.8 MB', icona: 'file', color: 'bg-amber-500 shadow-amber-200' },
      { titol: 'Exercicis SQL Avançat', nomFitxer: 'exercicis_sql.pdf', mida: '850 KB', icona: 'file', color: 'bg-indigo-500 shadow-indigo-200' },
    ];

    const folder = path.join(process.cwd(), 'uploads', 'recursos');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    for (const r of recursos) {
      const recurs = this.recursRepo.create({
        titol: r.titol,
        nomFitxer: r.nomFitxer,
        mida: r.mida,
        icona: r.icona,
        color: r.color,
        modul: moduls[Math.floor(Math.random() * moduls.length)],
        autor: professors[0],
      });
      await this.recursRepo.save(recurs);
      
      const ruta = path.join(folder, r.nomFitxer);
      fs.writeFileSync(ruta, `Contingut del recurs acadèmic: ${r.titol}`);
    }
  }

  private async crearMissatges(alumnes: Usuari[]) {
    if (alumnes.length > 0) {
      const msg = this.missatgeRepo.create({
        text: 'Benvinguts al xat oficial d\'ADSUM! Aquest és l\'històric persistent.',
        sala: 'GLOBAL',
        usuariId: alumnes[0].id,
      });
      await this.missatgeRepo.save(msg);

      // Crear una justificació de prova
      const just = this.justificacioRepo.create({
        alumneId: alumnes[0].id,
        dataInici: '2026-05-10',
        dataFi: '2026-05-11',
        motiu: 'Visita mèdica programada',
        estat: JustificacioEstat.PENDENT,
      });
      await this.justificacioRepo.save(just);
    }
  }
}
