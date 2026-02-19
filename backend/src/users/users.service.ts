import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Assistencia } from '../entities/assistencia.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuari)
    private readonly usuariRepositori: Repository<Usuari>,
    @InjectRepository(Assistencia)
    private readonly assistenciaRepositori: Repository<Assistencia>,
  ) {}

  async crear(dadesUsuari: Partial<Usuari>): Promise<Usuari> {
    const nouUsuari = this.usuariRepositori.create(dadesUsuari);

    if (dadesUsuari.contrasenyaHash) {
      const salt = await bcrypt.genSalt();
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
      const salt = await bcrypt.genSalt();
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
    // Use undefined instead of null if TypeORM complains about null for nullable fields in QueryDeepPartialEntity,
    // or just let it be null if the entity definition allows it.
    // Actually, for TypeORM update, setting to null should be fine if column is nullable.
    // The previous error might have been related to strictNullChecks.
    // Let's force casting or use simple object.
    await this.usuariRepositori.update(id, {
      contrasenyaHash: nouHash,
      tokenRecuperacio: null as any,
      caducitatTokenRecuperacio: null as any,
    });
  }

  // Mètode importat de dev i adaptat
  async getAlumneStats(id: number) {
    // Obtenir dades de l'alumne
    const alumne = await this.usuariRepositori.findOne({
      where: { id: id },
      relations: ['grup'],
    });

    if (!alumne) return null;

    // Obtenir totes les assistències de l'alumne
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
    // estat: present, justificat, absent, retard (enum values match lowercase strings used in compare)
    const presents = assistencies.filter(
      (a) => a.estat === 'present' || a.estat === 'justificat',
    ).length;
    const absents = assistencies.filter((a) => a.estat === 'absent').length;
    const retards = assistencies.filter((a) => a.estat === 'retard').length;
    const percentatge = total > 0 ? Math.round((presents / total) * 100) : 0;

    // Calcular ratxa actual (dies consecutius presents)
    let ratxa = 0;
    // Sort by date desc (already sorted by query but ensuring)
    const sorted = [...assistencies].sort(
      (a, b) => b.dataRegistre.getTime() - a.dataRegistre.getTime(),
    );
    for (const a of sorted) {
      if (a.estat === 'present') ratxa++;
      else break;
    }

    // Últimes 10 assistències per mostrar al frontend
    const recents = assistencies.slice(0, 10).map((a) => ({
      data: a.dataRegistre.toISOString().split('T')[0], // YYYY-MM-DD
      hora: a.dataRegistre.toTimeString().split(' ')[0], // HH:MM:SS
      modul: a.sessio?.assignacioDocent?.assignatura?.nom ?? 'Desconegut',
      estat: a.estat,
    }));

    return {
      nom: alumne.nom,
      email: alumne.email,
      grup: alumne.grup?.nom ?? '',
      curs: (alumne.grup as any)?.cursAcademic ?? '', // cursAcademic property name check
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
