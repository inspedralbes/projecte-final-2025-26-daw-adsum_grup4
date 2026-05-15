/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari, UserRole, NivellEducatiu } from '../entities/usuari.entity';
import { Grup } from '../entities/grup.entity';
import { Assignatura } from '../entities/assignatura.entity';
import { AssignacioDocent } from '../entities/assignacio-docent.entity';
import { Sessio, SessioEstat } from '../entities/sessio.entity';
import { ConfiguracioCentre } from '../entities/configuracio-centre.entity';
import { Familiar } from '../users/interfaces/dades-usuari.interface'; // Ensure interface is imported

import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuari)
    private readonly usuariRepo: Repository<Usuari>,
    @InjectRepository(Grup)
    private readonly grupRepo: Repository<Grup>,
    @InjectRepository(Assignatura)
    private readonly assignaturaRepo: Repository<Assignatura>,
    @InjectRepository(AssignacioDocent)
    private readonly assignacioDocentRepo: Repository<AssignacioDocent>,
    @InjectRepository(Sessio)
    private readonly sessioRepo: Repository<Sessio>,
    @InjectRepository(ConfiguracioCentre)
    private readonly configuracioCentreRepo: Repository<ConfiguracioCentre>,
  ) {}

  async onApplicationBootstrap() {
    try {
      console.log("[SEED] Starting seed execution...");
      
      const defaultUsers = [
        {
          email: 'alumne@adsum.cat',
          nom: 'Alumne',
          cognoms: 'Demo',
          password: 'password123',
          rol: UserRole.ALUMNE,
        },
        {
          email: 'professor@adsum.cat',
          nom: 'Professor',
          cognoms: 'Demo',
          password: 'password123',
          rol: UserRole.PROFESSOR,
        },
        {
          email: 'admin@adsum.cat',
          nom: 'Admin',
          cognoms: 'Demo',
          password: 'password123',
          rol: UserRole.ADMIN,
        },
      ];

      console.log("[SEED] Checking default users...");
      for (const u of defaultUsers) {
      const exists = await this.usuariRepo.findOne({
        where: { email: u.email },
      });
      if (!exists) {
        console.log(`[DEBUG SEED] Creant usuari per defecte: ${u.email}`);
        const contrasenyaHash = await bcrypt.hash(u.password, 10);
        const newUser = this.usuariRepo.create({
          email: u.email,
          nom: u.nom,
          cognoms: u.cognoms,
          contrasenyaHash,
          rol: u.rol,
          esActiu: true,
        });
        await this.usuariRepo.save(newUser);
        console.log(`[DEBUG SEED] Usuari creat correctament: ${u.email}`);
      } else {
        console.log(`[DEBUG SEED] L'usuari ja existeix: ${u.email}`);
      }
    }
    console.log("[SEED] Default users check completed.");
    } catch (error) {
      console.error("[SEED] Error during seed execution:", error);
    }
  }

  async executarSeed() {
    try {
      await this.esborrarTot();
      await this.crearConfiguracio();

      const dadesUsuaris = this.llegirJson('usuaris.json');
      const dadesAssignatures = this.llegirJson('assignatures.json');
      const dadesGrups = this.llegirJson('grups.json');

      const grupsMap = await this.crearGrups(dadesGrups);
      const admin = await this.crearAdmins(dadesUsuaris.admins);
      const professors = await this.crearProfessors(dadesUsuaris.professors);
      const assignatures = await this.crearAssignatures(dadesAssignatures);
      const alumnes = await this.crearAlumnes(grupsMap, dadesUsuaris.alumnes);

      // Assignacions d'exemple (simplificat)
      // Agafem el primer grup creat per assignar-li profes i assignatures
      const primerGrup = Array.from(grupsMap.values())[0];
      const assignacions = await this.crearAssignacions(
        primerGrup,
        professors,
        assignatures,
      );
      const sessions = await this.crearSessions(assignacions);

      return {
        missatge: 'SEED EXECUTAT CORRECTAMENT',
        dades: {
          admins: admin.length,
          grups: grupsMap.size,
          professors: professors.length,
          assignatures: assignatures.length,
          alumnes: alumnes.length,
          assignacions: assignacions.length,
          sessions: sessions.length,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        missatge: 'ERROR EN EXECUTAR SEED',
        error: error.message,
        stack: error.stack,
      };
    }
  }

  private llegirJson(nomFitxer: string) {
    const ruta = path.join(process.cwd(), 'dist', 'seed', 'data', nomFitxer);
    console.log('Llegint JSON des de:', ruta);
    const data = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(data);
  }

  private async esborrarTot() {
    await this.sessioRepo.createQueryBuilder().delete().execute();
    await this.assignacioDocentRepo.createQueryBuilder().delete().execute();
    await this.assignaturaRepo.createQueryBuilder().delete().execute();
    await this.usuariRepo.createQueryBuilder().delete().execute();
    await this.grupRepo.createQueryBuilder().delete().execute();
    await this.configuracioCentreRepo.createQueryBuilder().delete().execute();
  }

  private async crearConfiguracio() {
    const config = this.configuracioCentreRepo.create({
      id: 1,
      minutsTallRetard: 10,
      minutsTallAbsencia: 15,
      cursActual: '2025-2026',
    });
    await this.configuracioCentreRepo.save(config);
  }

  private async crearGrups(grupsData: any[]) {
    const grupsMap = new Map<string, Grup>();
    for (const g of grupsData) {
      const grup = this.grupRepo.create({
        codi: g.codi,
        nom: g.nom,
        aulaBase: g.aula_base,
        cursAcademic: '2025-2026',
      });
      const guardat = await this.grupRepo.save(grup);
      grupsMap.set(g.codi, guardat);
    }
    return grupsMap;
  }

  private async crearAdmins(adminsData: any[]) {
    const admins: Usuari[] = [];
    for (const d of adminsData) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(d.contrasenya, salt);
      const admin = this.usuariRepo.create({
        nom: d.nom,
        cognoms: d.cognoms,
        email: d.email,
        contrasenyaHash: hash,
        rol: UserRole.ADMIN,
        esActiu: true,
      });
      admins.push(await this.usuariRepo.save(admin));
    }
    return admins;
  }

  private async crearProfessors(profesData: any[]) {
    const professors: Usuari[] = [];
    for (const d of profesData) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(d.contrasenya, salt);
      const professor = this.usuariRepo.create({
        nom: d.nom,
        cognoms: d.cognoms,
        email: d.email,
        contrasenyaHash: hash,
        rol: UserRole.PROFESSOR,
        esActiu: true,
        departament: d.departament,
      });
      professors.push(await this.usuariRepo.save(professor));
    }
    return professors;
  }

  private async crearAssignatures(assignaturesData: any[]) {
    const guardades: Assignatura[] = [];
    for (const ass of assignaturesData) {
      const nova = this.assignaturaRepo.create({
        codi: ass.codi,
        nom: ass.nom,
        colorIdentificatiu: ass.color,
        descripcio: 'Assignatura de ' + ass.nom,
        curs: ass.curs,
        horesSetmanals: ass.hores_setmanals,
      });
      guardades.push(await this.assignaturaRepo.save(nova));
    }
    return guardades;
  }

  private async crearAlumnes(grupsMap: Map<string, Grup>, alumnesData: any[]) {
    const alumnes: Usuari[] = [];

    // Helper to check standard email format first
    const isValidEmail = (email: string) => email && email.includes('@');

    for (const d of alumnesData) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(d.contrasenya, salt);

      // Busquem el grup pel codi
      const grup = grupsMap.get(d.grup_codi);

      // Process Family Data to create Users
      const tutors: Usuari[] = [];
      const dadesFamiliaresArray = d.familia as unknown as Familiar[];

      if (dadesFamiliaresArray && Array.isArray(dadesFamiliaresArray)) {
        for (const fam of dadesFamiliaresArray) {
          // Try to generate a unique email if not provided or valid
          // In a real app we'd demand email, but for seeding we can fake it if missing
          let famEmail = fam.email;
          if (!famEmail || !isValidEmail(famEmail)) {
            // Create a fake email based on name + student surname + unique id
            const cleanName = fam.nom_complet
              .toLowerCase()
              .replace(/\s+/g, '.');
            famEmail = `${cleanName}@familia.adsum.cat`;
          }

          // Check if parent user already exists
          let tutor = await this.usuariRepo.findOne({
            where: { email: famEmail },
          });

          if (!tutor) {
            const passFamily = 'familia123';
            const hashFamily = await bcrypt.hash(passFamily, salt);

            // Split full name
            const parts = fam.nom_complet.split(' ');
            const nom = parts[0];
            const cognoms = parts.slice(1).join(' ') || 'Familiar';

            tutor = this.usuariRepo.create({
              nom: nom,
              cognoms: cognoms,
              email: famEmail,
              contrasenyaHash: hashFamily,
              rol: UserRole.FAMILIA,
              esActiu: true,
              telefon: fam.telefon_principal || undefined,
            });
            tutor = await this.usuariRepo.save(tutor);
          }
          tutors.push(tutor);
        }
      }

      const alumne = this.usuariRepo.create({
        nom: d.nom,
        cognoms: d.cognoms,
        email: d.email,
        contrasenyaHash: hash,
        rol: UserRole.ALUMNE,
        esActiu: true,
        grup: grup || undefined,
        nivellEducatiu: d.nivell_educatiu as NivellEducatiu,
        gamificacioData: d.gamificacio,
        configuracioUsuari: d.configuracio,
        dadesFamiliares: d.familia,
        tutors: tutors, // Link to parent users
      });
      alumnes.push(await this.usuariRepo.save(alumne));
    }
    return alumnes;
  }

  private async crearAssignacions(
    grup: Grup,
    professors: Usuari[],
    assignatures: Assignatura[],
  ) {
    const assignacions: AssignacioDocent[] = [];
    // Repartim assignatures entre els professors disponibles
    // Només assignem assignatures d'exemple al primer grup per tenir dades inicials
    for (let i = 0; i < assignatures.length; i++) {
      // Filtrem per curs si volguessim ser precisos, però de moment ho deixem generic
      if (i > 5) break; // Limitem per no crear massa assignacions de cop en l'exemple

      const profeAgarrat = professors[i % professors.length];
      const assignacio = this.assignacioDocentRepo.create({
        professor: profeAgarrat,
        assignatura: assignatures[i],
        grup: grup,
        anyAcademic: '2025-2026', // Coherent amb config centre
      });
      assignacions.push(await this.assignacioDocentRepo.save(assignacio));
    }
    return assignacions;
  }

  private async crearSessions(assignacions: AssignacioDocent[]) {
    const sessions: Sessio[] = [];
    if (assignacions.length > 0) {
      const sessio = this.sessioRepo.create({
        assignacioDocent: assignacions[0],
        dataInici: new Date(),
        estat: SessioEstat.ACTIVA,
        pinAcces: '123456',
        latitudOrigen: 41.3851,
        longitudOrigen: 2.1734,
      });
      sessions.push(await this.sessioRepo.save(sessio));
    }
    return sessions;
  }

  async getStatus() {
    const totalUsers = await this.usuariRepo.count();
    const admins = await this.usuariRepo.find({ where: { rol: 'ADMIN' as any } });
    const professors = await this.usuariRepo.find({ where: { rol: 'PROFESSOR' as any } });
    const alumnes = await this.usuariRepo.find({ where: { rol: 'ALUMNE' as any } });

    return {
      totalUsers,
      admins: admins.map(u => ({ email: u.email, nom: u.nom })),
      professors: professors.map(u => ({ email: u.email, nom: u.nom })),
      alumnesCount: alumnes.length,
    };
  }
}
