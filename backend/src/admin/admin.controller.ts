import {
    Controller,
    Get,
    Put,
    Delete,
    Post,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Res
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @Post('usuaris')
    async crearUsuari(@Body() dades: Partial<Usuari>) {
        return this.adminService.crearUsuari(dades);
    }

    @Get('analitica/absentisme')
    async obtenirAnalitica() {
        return this.adminService.getAnaliticaAbsentisme();
    }

    @Post('sincronitzacio/importar')
    @UseInterceptors(FileInterceptor('file'))
    async importarDades(@UploadedFile() file: any) {
        if (!file) throw new Error("No s'ha penjat cap arxiu.");
        return this.adminService.importarDadesProcess(file);
    }

    @Get('sincronitzacio/exportar')
    async exportarDades(@Res() res: Response) {
        const dadesCSV = await this.adminService.exportarGoogleSheets();
        res.header('Content-Type', 'text/csv');
        res.attachment('adsum_export_sheets.csv');
        return res.send(dadesCSV);
    }

    // --- FASE 2 ---

    @Get('infra/lectors')
    async obtenirEstatLectors() {
        return this.adminService.obtenirEstatLectors();
    }

    @Get('infra/usuaris-actius')
    async obtenirUsuarisActius() {
        return this.adminService.obtenirUsuarisActiusAra();
    }

    @Get('recursos')
    async obtenirRecursos() {
        return this.adminService.obtenirRecursos();
    }

    @Put('recursos/:id')
    async canviarEstatRecurs(@Param('id') id: string, @Body('estat') estat: string) {
        return this.adminService.canviarEstatRecurs(+id, estat);
    }

    @Post('recursos')
    async afegirRecurs(@Body() dades: any) {
        return this.adminService.afegirRecurs(dades);
    }

    @Get('ia/config')
    async getIAConfig() {
        return this.adminService.getIAConfig();
    }

    @Put('ia/config')
    async actualitzarPromptIA(@Body('prompt') prompt: string) {
        return this.adminService.actualitzarPromptIA(prompt);
    }

    @Post('ia/chat')
    async enviarMissatgeIA(@Body('missatge') missatge: string) {
        return this.adminService.enviarMissatgeIA(missatge);
    }

    @Post('sistema/tancar-curs')
    async tancarCursRestaurarRGPD(@Body('confirmacio') confirmacio: string) {
        return this.adminService.tancarCursRestaurarRGPD(confirmacio);
    }
}
