import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.contrasenya,
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
