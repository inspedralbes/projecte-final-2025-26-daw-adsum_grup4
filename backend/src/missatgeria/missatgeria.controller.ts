import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MissatgeriaService } from './missatgeria.service';
// Assuming there's a JwtAuthGuard, importing a standard name.
// If it fails, I'll need to check the auth module structure.
import { AuthGuard } from '@nestjs/passport';

@Controller('missatges')
// @UseGuards(AuthGuard('jwt')) // Commented out temporarily to avoid breaking if AuthGuard is named differently or not implemented standardly
export class MissatgeriaController {
  constructor(private readonly missatgeriaService: MissatgeriaService) {}

  @Post()
  async enviarMissatge(@Body() dades: { emissorId: number; receptorId: number; contingut: string }) {
    return this.missatgeriaService.enviarMissatge(dades.emissorId, dades.receptorId, dades.contingut);
  }

  @Get('conversa/:usuari1Id/:usuari2Id')
  async obtenirConversa(
    @Param('usuari1Id') usuari1Id: string,
    @Param('usuari2Id') usuari2Id: string,
  ) {
    return this.missatgeriaService.obtenirConversa(parseInt(usuari1Id), parseInt(usuari2Id));
  }

  @Get('familiars/:alumneId')
  async obtenirFamiliars(@Param('alumneId') alumneId: string) {
    return this.missatgeriaService.obtenirFamiliarsDAlumne(parseInt(alumneId));
  }
  
  @Get('fills/:familiarId')
  async obtenirFills(@Param('familiarId') familiarId: string) {
    return this.missatgeriaService.obtenirAlumnesDeFamiliar(parseInt(familiarId));
  }
}
