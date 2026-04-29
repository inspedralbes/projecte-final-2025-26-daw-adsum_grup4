/* eslint-disable @typescript-eslint/no-misused-promises */
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
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    @Inject(forwardRef(() => AttendanceService))
    private readonly attendanceService: AttendanceService,
  ) {}

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
  async handleJoinModule(client: Socket, modulId: number) {
    const room = `module_${modulId}`;
    await client.join(room);
    console.log(`Cliente ${client.id} unido a sala ${room}`);
    return { event: 'joined', room };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: '¡Hola desde el Backend!' };
  }

  onModuleInit() {
    this.startQrLoop();
  }

  startQrLoop() {
    setInterval(async () => {
      const tokenData = await this.attendanceService.generateToken(0, 0);
      this.server.emit('new_qr', {
        token: tokenData.token,
        expiresAt: tokenData.expiresAt,
      });
      console.log('Nou QR generat', tokenData.token);
    }, 5000);
  }

  notifyAttendance(modulId: number, data: any) {
    const room = `module_${modulId}`;
    this.server.to(room).emit('attendance_updated', data);
    console.log(`Notificación de asistencia enviada a sala ${room}`);
  }
}
