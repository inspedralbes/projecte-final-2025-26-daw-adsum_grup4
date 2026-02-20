import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AttendanceService } from './attendance.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class AttendanceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly attendanceService: AttendanceService) { }

  afterInit() {
    console.log('Socket.io Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: '¡Hola desde el Backend!' };
  }

  onModuleInit() {
    this.startQrLoop();
  }

  startQrLoop() {
    // Generamos un nuevo QR cada 5 segundos (per als antics tests de QR)
    setInterval(async () => {
      // Passem IDs per defecte per evitar errors si el loop segueix actiu
      const tokenData = await this.attendanceService.generateToken(0, 0);
      this.server.emit('new_qr', {
        token: tokenData.token,
        expiresAt: tokenData.expiresAt,
      });
      console.log('Nou QR generat', tokenData.token);
    }, 5000);
  }
}