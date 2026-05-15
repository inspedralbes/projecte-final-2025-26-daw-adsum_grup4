import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Missatge } from '../entities/missatge.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(Missatge)
    private missatgeRepository: Repository<Missatge>,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userEmail

  handleConnection(client: Socket) {
    console.log(`Client connectat al xat: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client desconnectat del xat: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { room: string; user: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.connectedUsers.set(client.id, data.user.email);
    console.log(`Usuari ${data.user.email} s'ha unit a la sala: ${data.room}`);
    
    // Recuperar l'històric de la sala (últims 50 missatges)
    const historic = await this.missatgeRepository.find({
      where: { sala: data.room },
      relations: ['usuari'],
      order: { dataEnviament: 'ASC' },
      take: 50,
    });

    // Enviar l'històric només al client que s'acaba d'unir
    client.emit('chat_history', historic.map(m => ({
      id: m.id,
      room: m.sala,
      user: m.usuari.nom,
      email: m.usuari.email,
      text: m.text,
      hora: m.dataEnviament.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meu: m.usuari.email === data.user.email,
    })));

    // Notificar a la sala que algú s'ha unit
    client.to(data.room).emit('user_joined', {
      user: data.user.nom,
      message: 's\'ha unit al xat',
    });
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { room: string; user: any; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Guardar el missatge a la base de dades
    const nouMissatge = this.missatgeRepository.create({
      text: data.text,
      sala: data.room,
      usuariId: data.user.id,
    });
    const salvat = await this.missatgeRepository.save(nouMissatge);

    const message = {
      id: salvat.id,
      room: data.room,
      user: data.user.nom,
      email: data.user.email,
      text: data.text,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meu: false,
    };

    console.log(`Missatge rebut a ${data.room}: ${data.text}`);
    
    // Enviar a tothom a la sala EXCEPTE al que l'envia
    client.to(data.room).emit('new_message', message);
  }
}
