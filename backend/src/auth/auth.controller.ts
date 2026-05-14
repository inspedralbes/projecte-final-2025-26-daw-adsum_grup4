/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const password = loginDto.contrasenya || loginDto.password;
    const ip = req.ip || req.socket.remoteAddress;
    const user = await this.authService.validateUser(
      loginDto.email,
      password,
      ip,
    );

    if (!user) {
      throw new UnauthorizedException('Credencials invàlides');
    }

    return this.authService.login(user);
  }

  @Post('recuperar-contrasenya')
  async recuperarContrasenya(@Body('email') email: string) {
    return this.authService.recuperarContrasenya(email);
  }

  @Post('restablir-contrasenya')
  async restablirContrasenya(
    @Body('token') token: string,
    @Body('novaContrasenya') novaContrasenya: string,
  ) {
    return this.authService.restablirContrasenya(token, novaContrasenya);
  }
}
