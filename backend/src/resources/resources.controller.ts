import { Controller, Get, Param, Res, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('api/recursos')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async llistar() {
    return this.resourcesService.obtenirTots();
  }

  @Get('descarregar/:id')
  async descarregar(@Param('id') id: number, @Query('token') token: string, @Res() res: any) {
    console.log(`[RECURSOS] Intentant descarregar ID: ${id} amb token: ${token?.substring(0, 10)}...`);
    try {
      this.jwtService.verify(token);
      console.log(`[RECURSOS] Token validat amb èxit`);
    } catch (e) {
      console.error(`[RECURSOS] Error de validació de token:`, e.message);
      throw new UnauthorizedException('Token de descàrrega invàlid');
    }

    const recurs = await this.resourcesService.obtenirPerId(id);
    const ruta = this.resourcesService.getRutaFitxer(recurs.nomFitxer);
    console.log(`[RECURSOS] Servint fitxer: ${ruta}`);
    
    res.download(ruta, recurs.nomFitxer);
  }
}
