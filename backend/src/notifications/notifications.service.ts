import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { SubscripcioPush } from '../entities/subscripcio-push.entity';
import { Usuari, UserRole } from '../entities/usuari.entity';

@Injectable()
export class NotificacionsService {
  private readonly logger = new Logger(NotificacionsService.name);

  constructor(
    @InjectRepository(SubscripcioPush)
    private subscripcioRepo: Repository<SubscripcioPush>,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.configService.get<string>('VAPID_SUBJECT');

    webpush.setVapidDetails(subject, publicKey, privateKey);
  }

  async subscriure(usuari: Usuari, subscription: any, userAgent: string) {
    const tokenString = JSON.stringify(subscription);

    const existeix = await this.subscripcioRepo.findOne({
      where: {
        tokenSubscripcio: tokenString,
        usuari: { id: usuari.id },
      },
    });

    if (existeix) {
      return { missatge: 'Subscripció ja existent' };
    }

    const novaSubscripcio = this.subscripcioRepo.create({
      usuari: usuari,
      tokenSubscripcio: tokenString,
      agentUsuari: userAgent,
    });

    await this.subscripcioRepo.save(novaSubscripcio);
    return { missatge: 'Subscripció guardada correctament' };
  }

  async enviarNotificacioFamilia(
    alumnes: Usuari[],
    titol: string,
    cos: string,
    data?: any,
  ): Promise<void> {
    const paresIds = new Set<number>();

    this.logger.log(`Buscant tutors per a ${alumnes.length} alumnes`);

    for (const alumne of alumnes) {
      this.logger.log(`Buscant alumne ${alumne.id} - ${alumne.nom}`);
      
      const alumneComplet = await this.dataSource.manager.findOne(Usuari, {
        where: { id: alumne.id },
        relations: ['tutors'],
      });

      this.logger.log(`Alumne complet: ${JSON.stringify(alumneComplet?.tutors?.map(t => t.id))}`);

      if (alumneComplet?.tutors) {
        for (const tutor of alumneComplet.tutors) {
          this.logger.log(`Tutor trobat: ${tutor.id} - ${tutor.nom} - rol: ${tutor.rol}`);
          if (tutor.rol === UserRole.FAMILIA) {
            paresIds.add(tutor.id);
          }
        }
      }
    }

    this.logger.log(`Total tutors trobats: ${paresIds.size} - IDs: ${Array.from(paresIds).join(', ')}`);

    if (paresIds.size === 0) {
      this.logger.log('No s\'han trobat tutors per enviar notificació');
      return;
    }

    const subscripcions = await this.subscripcioRepo.find({
      where: Array.from(paresIds).map((id) => ({ usuariId: id })),
    });

    this.logger.log(`Subscripcions push trobades: ${subscripcions.length}`);

    if (subscripcions.length === 0) {
      this.logger.log('No hi ha subscripcions push registrades per als tutors');
      return;
    }

    const payload = JSON.stringify({
      title: titol,
      body: cos,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: data || {},
    });

    for (const subscripcio of subscripcions) {
      try {
        const subscription = JSON.parse(subscripcio.tokenSubscripcio);
        await webpush.sendNotification(subscription, payload);
        this.logger.log(`Notificació enviada a usuari ${subscripcio.usuariId}`);
      } catch (error) {
        this.logger.error(
          `Error enviant notificació a usuari ${subscripcio.usuariId}: ${error.message}`,
        );
        if (error.statusCode === 404 || error.statusCode === 410) {
          await this.subscripcioRepo.delete(subscripcio.id);
          this.logger.log(`Subscripció ${subscripcio.id} eliminada (expirada)`);
        }
      }
    }
  }

  getVapidPublicKey(): string {
    return this.configService.get<string>('VAPID_PUBLIC_KEY') || '';
  }
}
