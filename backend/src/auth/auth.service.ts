import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.contrasenyaHash))) {
            const { contrasenyaHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, rol: user.rol, nom: user.nom, cognoms: user.cognoms };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload
        };
    }

    // Genera un token temporal i l'envia per email (simulat)
    async recuperarContrasenya(email: string) {
        const usuari = await this.usersService.findOneByEmail(email);
        if (!usuari) {
            // Per seguretat, no diem si l'email existeix o no
            return { missatge: 'Si el correu existeix, rebràs instruccions.' };
        }

        // Generem token aleatori simple
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Caducitat d'1 hora
        const caducitat = new Date();
        caducitat.setHours(caducitat.getHours() + 1);

        // Guardem al servei d'usuaris (caldrà afegir mètode update o fer-ho aquí si tenim repo)
        // Com que AuthService utilitza UsersService, ho deleguem o ho fem directe si injectem el repo.
        // Per simplicitat i no modificar massa UsersService ara, assumim que UsersService pot guardar o injectem Repo.
        // Mirem com està AuthService... injecta UsersService.
        // Modificaré UsersService per permetre guardar el token.
        await this.usersService.guardarTokenRecuperacio(usuari.id, token, caducitat);

        console.log(`[SIMULACIÓ EMAIL] Enviar a ${email}: Fes click aquí per recuperar: http://localhost:5173/reset-password?token=${token}`);

        return { missatge: 'Si el correu existeix, rebràs instruccions.' };
    }

    async restablirContrasenya(token: string, novaContrasenya: string) {
        const usuari = await this.usersService.trobarPerTokenRecuperacio(token);

        if (!usuari) {
            throw new BadRequestException('Token invàlid o expirat');
        }

        // Comprovem caducitat
        if (usuari.caducitatTokenRecuperacio < new Date()) {
            throw new BadRequestException('El token ha caducat');
        }

        // Encriptem nova contrasenya
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(novaContrasenya, salt);

        // Actualitzem usuari i netegem token
        await this.usersService.actualitzarContrasenya(usuari.id, hash);

        return { missatge: 'Contrasenya actualitzada correctament' };
    }
}
