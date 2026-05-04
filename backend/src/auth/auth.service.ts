/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as crypto from 'crypto';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logs/logs.service';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: LogsService,
  ) {}

  async validateUser(email: string, pass: string, ip?: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.loginFailed(email, 'USER_NOT_FOUND', ip);
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.contrasenyaHash);

    if (isMatch) {
      this.logger.loginSuccess(user.id, email, ip);
      const { contrasenyaHash: _unused, ...result } = user;
      return result;
    }

    this.logger.loginFailed(email, 'INVALID_PASSWORD', ip);
    return null;
  }

  login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      rol: user.rol,
      nom: user.nom,
      cognoms: user.cognoms,
      grup_id: user.grup_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  // Genera un token temporal i l'envia per email (simulat)
  async recuperarContrasenya(email: string) {
    const usuari = await this.usersService.findByEmail(email);
    if (!usuari) {
      // Per seguretat, no diem si l'email existeix o no
      return { missatge: 'Si el correu existeix, rebràs instruccions.' };
    }

    // Generem token aleatori simple
    const token = crypto.randomBytes(32).toString('hex');
    // Caducitat d'1 hora
    const caducitat = new Date();
    caducitat.setHours(caducitat.getHours() + 1);

    await this.usersService.guardarTokenRecuperacio(
      usuari.id,
      token,
      caducitat,
    );

    console.log(
      `[SIMULACIÓ EMAIL] Enviar a ${email}: Fes click aquí per recuperar: http://localhost:5173/reset-password?token=${token}`,
    );

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
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(novaContrasenya, salt);

    // Actualitzem usuari i netegem token
    await this.usersService.actualitzarContrasenya(usuari.id, hash);

    return { missatge: 'Contrasenya actualitzada correctament' };
  }
}
