import { Controller, Request, Post, UseGuards, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        return this.authService.login(req);
    }

    @Post('recuperar-contrasenya')
    async recuperarContrasenya(@Body('email') email: string) {
        return this.authService.recuperarContrasenya(email);
    }

    @Post('restablir-contrasenya')
    async restablirContrasenya(@Body('token') token: string, @Body('novaContrasenya') novaContrasenya: string) {
        return this.authService.restablirContrasenya(token, novaContrasenya);
    }
}
