import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuari, UserRole } from '../entities/usuari.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Usuari)
        private readonly usersRepository: Repository<Usuari>,
    ) { }

    async onApplicationBootstrap() {
        const defaultUsers = [
            { email: 'alumne@adsum.cat', nom: 'Alumne Demo', password: 'password123', rol: UserRole.ALUMNE },
            { email: 'professor@adsum.cat', nom: 'Professor Demo', password: 'password123', rol: UserRole.PROFESSOR },
            { email: 'admin@adsum.cat', nom: 'Admin Demo', password: 'password123', rol: UserRole.PROFESSOR },
        ];

        for (const u of defaultUsers) {
            const exists = await this.usersRepository.findOne({ where: { email: u.email } });
            if (!exists) {
                const contrasenyaHash = await bcrypt.hash(u.password, 10);
                const newUser = this.usersRepository.create({
                    email: u.email,
                    nom: u.nom,
                    contrasenyaHash,
                    rol: u.rol,
                });
                await this.usersRepository.save(newUser);
                console.log(`Seeded user: ${u.email} with password: ${u.password}`);
            }
        }
    }
}
