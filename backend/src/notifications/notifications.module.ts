import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionsController } from './notifications.controller';
import { NotificacionsService } from './notifications.service';
import { SubscripcioPush } from '../entities/subscripcio-push.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubscripcioPush]),
        AuthModule
    ],
    controllers: [NotificacionsController],
    providers: [NotificacionsService],
    exports: [NotificacionsService]
})
export class NotificacionsModule { }
