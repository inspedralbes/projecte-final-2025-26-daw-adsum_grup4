import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscripcioPush } from '../entities/subscripcio-push.entity';
import { Usuari } from '../entities/usuari.entity';

@Injectable()
export class NotificacionsService {
    constructor(
        @InjectRepository(SubscripcioPush)
        private subscripcioRepo: Repository<SubscripcioPush>,
    ) { }

    // Guarda el token de subscripció que rebem del navegador
    async subscriure(usuari: Usuari, subscription: any, userAgent: string) {
        // Convertim l'objecte subscription a string per guardar-lo a la BD
        const tokenString = JSON.stringify(subscription);

        // Comprovem si ja existeix aquesta subscripció per evitar duplicats
        const existeix = await this.subscripcioRepo.findOne({
            where: {
                tokenSubscripcio: tokenString,
                usuari: { id: usuari.id }
            }
        });

        if (existeix) {
            return { missatge: 'Subscripció ja existent' };
        }

        const novaSubscripcio = this.subscripcioRepo.create({
            usuari: usuari,
            tokenSubscripcio: tokenString,
            agentUsuari: userAgent
        });

        await this.subscripcioRepo.save(novaSubscripcio);
        return { missatge: 'Subscripció guardada correctament' };
    }
}
