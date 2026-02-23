import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.contrasenyaHash)) {
            const { contrasenyaHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, rol: user.rol, grup_id: user.grup_id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                rol: user.rol
            }
        };
    }
}
