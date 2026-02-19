import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari } from '../entities/usuari.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Usuari)
        private readonly usuariRepositori: Repository<Usuari>,
    ) { }

    async crear(dadesUsuari: Partial<Usuari>): Promise<Usuari> {
        const nouUsuari = this.usuariRepositori.create(dadesUsuari);

        if (dadesUsuari.contrasenyaHash) {
            const salt = await bcrypt.genSalt();
            nouUsuari.contrasenyaHash = await bcrypt.hash(dadesUsuari.contrasenyaHash, salt);
        }

        return await this.usuariRepositori.save(nouUsuari);
    }

    async trobarTots(): Promise<Usuari[]> {
        return await this.usuariRepositori.find();
    }

    async trobarUn(id: number): Promise<Usuari> {
        const usuari = await this.usuariRepositori.findOne({ where: { id } });
        if (!usuari) {
            throw new NotFoundException('L\'usuari amb ID ' + id + ' no existeix');
        }
        return usuari;
    }

    async actualitzar(id: number, dadesActualitzades: Partial<Usuari>): Promise<Usuari> {
        const usuari = await this.trobarUn(id);

        if (dadesActualitzades.contrasenyaHash) {
            const salt = await bcrypt.genSalt();
            dadesActualitzades.contrasenyaHash = await bcrypt.hash(dadesActualitzades.contrasenyaHash, salt);
        }

        const usuariActualitzat = Object.assign(usuari, dadesActualitzades);
        return await this.usuariRepositori.save(usuariActualitzat);
    }

    async eliminar(id: number): Promise<void> {
        const resultat = await this.usuariRepositori.delete(id);
        if (resultat.affected === 0) {
            throw new NotFoundException('No s\'ha pogut eliminar l\'usuari amb ID ' + id + ' perquè no existeix');
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
            caducitatTokenRecuperacio: caducitat
        });
    }

    async trobarPerTokenRecuperacio(token: string): Promise<Usuari | null> {
        return this.usuariRepositori.findOne({ where: { tokenRecuperacio: token } });
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
            caducitatTokenRecuperacio: null as any
        });
    }
}
