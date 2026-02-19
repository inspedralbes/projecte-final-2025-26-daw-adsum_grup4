import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { Usuari } from '../entities/usuari.entity';

@Controller('api/usuaris')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async crearUsuari(@Body() dadesUsuari: Partial<Usuari>): Promise<Usuari> {
        return await this.usersService.crear(dadesUsuari);
    }

    @Get()
    async obtenirTots(): Promise<Usuari[]> {
        return await this.usersService.trobarTots();
    }

    @Get(':id')
    async obtenirPerId(@Param('id') id: string): Promise<Usuari> {
        return await this.usersService.trobarUn(+id);
    }

    @Put(':id')
    async actualitzarUsuari(@Param('id') id: string, @Body() dadesActualitzades: Partial<Usuari>): Promise<Usuari> {
        return await this.usersService.actualitzar(+id, dadesActualitzades);
    }

    @Delete(':id')
    async eliminarUsuari(@Param('id') id: string): Promise<void> {
        return await this.usersService.eliminar(+id);
    }
}
