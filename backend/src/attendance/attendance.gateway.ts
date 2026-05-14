import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AttendanceService } from './attendance.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
})
export class AttendanceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    @Inject(forwardRef(() => AttendanceService))
    private readonly attendanceService: AttendanceService,
  ) { }

  afterInit() {
    console.log('Socket.io Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('join_module')
  handleJoinModule(client: Socket, modulId: number) {
    const room = `module_${modulId}`;
    client.join(room);
    console.log(`Cliente ${client.id} unido a sala ${room}`);
    return { event: 'joined', room };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: '¡Hola desde el Backend!' };
  }

  notifyAttendance(modulId: number, data: any) {
    const room = `module_${modulId}`;
    this.server.to(room).emit('attendance_updated', data);
    console.log(`Notificació d'assistència enviada a sala ${room}`);
  }

  broadcastNewToken(modulId: number, token: string) {
    const room = `module_${modulId}`;
    this.server.to(room).emit('new_qr', {
      token: token,
      expiresAt: new Date(Date.now() + 5000), // Válido para los próximos 5s en modo dinámico
    });
    console.log(`Nou token ${token} enviat a sala ${room}`);
  }

  notifyHallPass(modulId: number, data: any) {
    const room = `module_${modulId}`;
    this.server.to(room).emit('hall_pass_updated', data);
    console.log(`Notificació de passadís enviada a sala ${room}`);
  }
}
