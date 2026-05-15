/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Usuari, UserRole } from '../entities/usuari.entity';
import { Assistencia, AssistenciaEstat } from '../entities/assistencia.entity';
import { Modul } from '../entities/modul.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuari)
    private readonly usuariRepositori: Repository<Usuari>,
    @InjectRepository(Assistencia)
    private readonly assistenciaRepositori: Repository<Assistencia>,
    @InjectRepository(Modul)
    private readonly modulRepositori: Repository<Modul>,
  ) {}

  async crear(dadesUsuari: Partial<Usuari>): Promise<Usuari> {
    const nouUsuari = this.usuariRepositori.create(dadesUsuari);

    if (dadesUsuari.contrasenyaHash) {
      const salt = await bcrypt.genSalt(10);
      nouUsuari.contrasenyaHash = await bcrypt.hash(
        dadesUsuari.contrasenyaHash,
        salt,
      );
    }

    return await this.usuariRepositori.save(nouUsuari);
  }

  async trobarTots(): Promise<Usuari[]> {
    return await this.usuariRepositori.find();
  }

  async trobarUn(id: number): Promise<Usuari> {
    const usuari = await this.usuariRepositori.findOne({ where: { id } });
    if (!usuari) {
      throw new NotFoundException("L'usuari amb ID " + id + ' no existeix');
    }
    return usuari;
  }

  async actualitzar(
    id: number,
    dadesActualitzades: Partial<Usuari>,
  ): Promise<Usuari> {
    const usuari = await this.trobarUn(id);

    if (dadesActualitzades.contrasenyaHash) {
      const salt = await bcrypt.genSalt(10);
      dadesActualitzades.contrasenyaHash = await bcrypt.hash(
        dadesActualitzades.contrasenyaHash,
        salt,
      );
    }

    const usuariActualitzat = Object.assign(usuari, dadesActualitzades);
    return await this.usuariRepositori.save(usuariActualitzat);
  }

  async eliminar(id: number): Promise<void> {
    const resultat = await this.usuariRepositori.delete(id);
    if (resultat.affected === 0) {
      throw new NotFoundException(
        "No s'ha pogut eliminar l'usuari amb ID " + id + ' perquè no existeix',
      );
    }
  }

  async trobarPerEmail(email: string): Promise<Usuari | null> {
    return await this.usuariRepositori.findOne({ where: { email } });
  }

  async findByEmail(email: string): Promise<Usuari | null> {
    return this.trobarPerEmail(email);
  }

  async findOneByEmail(email: string): Promise<Usuari | null> {
    return this.trobarPerEmail(email);
  }

  async findOne(id: number): Promise<Usuari | null> {
    return this.usuariRepositori.findOne({ where: { id } });
  }

  async guardarTokenRecuperacio(id: number, token: string, caducitat: Date) {
    await this.usuariRepositori.update(id, {
      tokenRecuperacio: token,
      caducitatTokenRecuperacio: caducitat,
    });
  }

  async trobarPerTokenRecuperacio(token: string): Promise<Usuari | null> {
    return this.usuariRepositori.findOne({
      where: { tokenRecuperacio: token },
    });
  }

  async actualitzarContrasenya(id: number, nouHash: string) {
    await this.usuariRepositori.update(id, {
      contrasenyaHash: nouHash,
      tokenRecuperacio: null as any,
      caducitatTokenRecuperacio: null as any,
    });
  }

  async getAlumneStats(id: number) {
    const alumne = await this.usuariRepositori.findOne({
      where: { id: id },
      relations: ['grup'],
    });

    if (!alumne) return null;

    const assistencies = await this.assistenciaRepositori.find({
      where: { alumne: { id: id } },
      relations: [
        'sessio',
        'sessio.assignacioDocent',
        'sessio.assignacioDocent.assignatura',
      ],
      order: { dataRegistre: 'DESC' },
    });

    const total = assistencies.length;
    const presents = assistencies.filter(
      (a) =>
        a.estat === AssistenciaEstat.PRESENT ||
        a.estat === AssistenciaEstat.JUSTIFICAT,
    ).length;
    const absents = assistencies.filter(
      (a) => a.estat === AssistenciaEstat.ABSENT,
    ).length;
    const retards = assistencies.filter(
      (a) => a.estat === AssistenciaEstat.RETARD,
    ).length;
    const percentatge = total > 0 ? Math.round((presents / total) * 100) : 0;

    let ratxa = 0;
    const sorted = [...assistencies].sort(
      (a, b) => b.dataRegistre.getTime() - a.dataRegistre.getTime(),
    );
    for (const a of sorted) {
      if (a.estat === AssistenciaEstat.PRESENT) ratxa++;
      else break;
    }

    const recents = assistencies.slice(0, 10).map((a) => ({
      data: a.dataRegistre.toISOString().split('T')[0],
      hora: a.dataRegistre.toTimeString().split(' ')[0],
      modul: a.sessio?.assignacioDocent?.assignatura?.nom ?? 'Desconegut',
      estat: a.estat,
    }));

    return {
      nom: alumne.nom,
      email: alumne.email,
      grup: alumne.grup?.nom ?? '',
      curs: (alumne.grup as any)?.cursAcademic ?? '',
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
    return await this.modulRepositori.find({
      where: { professor_id: id },
      relations: ['grup'],
    });
  }

  async getModulStudents(modulId: number) {
    const modul = await this.modulRepositori.findOne({
      where: { id: modulId }, // Corrected id_modul to id
      relations: ['grup'],
    });

    if (!modul) return null;

    const alumnes = await this.usuariRepositori.find({
      where: { grup: { id: modul.grup_id }, rol: UserRole.ALUMNE },
      order: { nom: 'ASC' },
    });

    const totHistorial = await this.assistenciaRepositori.find({
      where: { alumne: { id: In(alumnes.map((a) => a.id)) } },
    });

    const avui = new Date().toISOString().split('T')[0];

    return alumnes.map((alumne) => {
      const historialAlumne = totHistorial.filter(
        (h) => h.alumne?.id === alumne.id,
      );
      const assistenciaAvui = historialAlumne.find((h) => {
        const hData =
          h.dataRegistre instanceof Date
            ? h.dataRegistre.toISOString().split('T')[0]
            : String(h.dataRegistre).split('T')[0];
        return h.modulId === modulId && hData === avui;
      });

      return {
        id: alumne.id,
        nom: alumne.nom,
        email: alumne.email,
        foto:
          (alumne as any).fotoUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${alumne.nom}`,
        telefon: alumne.telefon || '600 000 000',
        estat: assistenciaAvui ? assistenciaAvui.estat : 'pendent',
        faltas_acumuladas: historialAlumne.filter(
          (h) => h.estat === AssistenciaEstat.ABSENT,
        ).length,
        retrasos_acumulados: historialAlumne.filter(
          (h) => h.estat === AssistenciaEstat.RETARD,
        ).length,
      };
    });
  }

  async seedStudents(modulId: number) {
    const modul = await this.modulRepositori.findOne({
      where: { id: modulId }, // Corrected id_modul to id
      relations: ['grup'],
    });

    if (!modul || !modul.grup_id)
      return { success: false, message: 'Module or Group not found' };

    const currentStudents = await this.usuariRepositori.count({
      where: { grup: { id: modul.grup_id }, rol: UserRole.ALUMNE },
    });

    if (currentStudents >= 20) {
      return {
        success: true,
        message: `Already has ${currentStudents} students`,
      };
    }

    const names = [
      'Marc Roig',
      'Laia Sols',
      'Pol Vila',
      'Anna Bosch',
      'Joan Martí',
      'Carla Puig',
      'Miquel Serra',
      'Elena Roca',
      'Jordi Font',
      'Sílvia Mas',
      'Albert Soler',
      'Marta Vidal',
      'Pau Casals',
      'Núria Riera',
      'Roger Molins',
      'Laura Gallart',
      'Oriol Rovira',
      'Clara Valls',
      'Xavier Bosch',
      'Irene Solà',
      'Bernat Figueras',
      'Marina Prats',
    ];

    const newStudents: Usuari[] = [];
    for (let i = currentStudents; i < 22; i++) {
      const name = names[i % names.length] + (i > names.length ? ` ${i}` : '');
      const email = `student${i}@example.com`;

      const student = this.usuariRepositori.create({
        nom: name,
        email: email,
        contrasenyaHash: 'hashed_password', // Mock password
        rol: UserRole.ALUMNE,
        grup: { id: modul.grup_id } as any,
        fotoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        telefon: `600 ${100 + i} ${200 + i}`,
      });
      newStudents.push(student);
    }

    await this.usuariRepositori.save(newStudents);
    return { success: true, message: `Added ${newStudents.length} students` };
  }

  async getAlumneNotes(id: number) {
    const usuari = await this.usuariRepositori.findOne({
      where: { id },
      relations: ['notes', 'notes.modul'],
    });
    if (!usuari) return [];
    return usuari.notes.map(n => ({
      id: n.id_nota,
      modul: n.modul?.nom || 'Desconegut',
      valor: Number(n.valor),
      comentari: n.comentari,
      data: n.data_registre
    }));
  }

  async getAlumneSchedule(id: number) {
    const alumne = await this.usuariRepositori.findOne({
      where: { id },
      relations: ['grup'],
    });
    if (!alumne || !alumne.grup) return [];

    // Busquem mòduls del grup de l'alumne
    const moduls = await this.modulRepositori.find({
      where: { grup: { id: alumne.grup.id } },
      relations: ['professor'],
    });

    // Per a la demo, retornem sessions fixes basades en els mòduls del grup
    return moduls.map(m => ({
      id: m.id,
      modul: m.nom,
      professor: `${m.professor?.nom} ${m.professor?.cognoms}`,
      hora: '08:00 - 14:00', // Horari estàndard FP
      aula: alumne.grup?.aulaBase || 'Aula 101',
      estat: 'pendent'
    }));
  }
}
