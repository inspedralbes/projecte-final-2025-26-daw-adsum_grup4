import {
    Controller,
    Get,
    Put,
    Delete,
    Post,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { Usuari } from '../entities/usuari.entity';

@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('usuaris')
    async obtenirUsuaris() {
        return this.adminService.obtenirUsuaris();
    }

    @Put('usuaris/:id')
    async actualitzarUsuari(
        @Param('id') id: string,
        @Body() dades: Partial<Usuari>,
    ) {
        return this.adminService.actualitzarUsuari(+id, dades);
    }

    @Delete('usuaris/:id')
    async eliminarUsuari(@Param('id') id: string) {
        return this.adminService.eliminarUsuari(+id);
    }

    @Get('analitica/absentisme')
    async obtenirAnalitica() {
        return this.adminService.getAnaliticaAbsentisme();
    }

    @Post('sincronitzacio/importar')
    async importarDades(@Body() payload: any) {
        return this.adminService.importarDadesProcess(payload);
    }

    // --- FASE 2 ---

    @Get('infra/lectors')
    async obtenirEstatLectors() {
        return this.adminService.obtenirEstatLectors();
    }

    @Get('recursos')
    async obtenirRecursos() {
        return this.adminService.obtenirRecursos();
    }

    @Put('recursos/:id')
    async canviarEstatRecurs(@Param('id') id: string, @Body('estat') estat: string) {
        return this.adminService.canviarEstatRecurs(+id, estat);
    }

    @Get('ia/config')
    async getIAConfig() {
        return this.adminService.getIAConfig();
    }

    @Put('ia/config')
    async actualitzarPromptIA(@Body('prompt') prompt: string) {
        return this.adminService.actualitzarPromptIA(prompt);
    }

    @Post('sistema/tancar-curs')
    async tancarCursRestaurarRGPD(@Body('confirmacio') confirmacio: string) {
        return this.adminService.tancarCursRestaurarRGPD(confirmacio);
    }
}
