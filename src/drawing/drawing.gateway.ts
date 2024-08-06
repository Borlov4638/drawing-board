import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DrawingPointMessage } from './types/drawing-brush.type';
import { DRAWING_EVENT } from './constants';
import { DrawingDataType } from './types/drawing-data.type';
import { DrawingHistoryRepository } from './drawing-history.repository';

@WebSocketGateway({ cors: '*:*' })
export class DrawingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  roomDrawingHistory = new Map<string, Set<DrawingPointMessage>>();
  logger = new Logger(DrawingGateway.name);

  constructor(private drawingHistoryService: DrawingHistoryRepository) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(DRAWING_EVENT.DRAWING)
  handleDrawing(client: Socket, data: DrawingDataType): void {
    client.broadcast.to(data.room).emit(DRAWING_EVENT.DRAWING, data.point);
    const drawingHistory = this.roomDrawingHistory.get(data.room);
    drawingHistory.add(data.point);
  }

  @SubscribeMessage(DRAWING_EVENT.JOIN_ROOM)
  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    client.join(room);
    if (!this.roomDrawingHistory.has(room)) {
      const history = await this.drawingHistoryService.getHistory(room);
      this.roomDrawingHistory.set(room, new Set<DrawingPointMessage>(history));
    }

    this.logger.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage(DRAWING_EVENT.LEAVE_ROOM)
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);

    if (this.isRoomEmpty(room)) {
      this.roomDrawingHistory.delete(room);
    }

    this.logger.log(`Client ${client.id} left room ${room}`);
  }

  private isRoomEmpty(room: string): boolean {
    const clientsInRoom = this.server.sockets.adapter.rooms.get(room);
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;
    if (numberOfClients === 0) {
      return true;
    } else {
      return false;
    }
  }

  @SubscribeMessage(DRAWING_EVENT.GET_HISTORY)
  getRoomHistory(client: Socket, room: string): void {
    const drawingHistory = this.roomDrawingHistory.get(room);
    drawingHistory.forEach((point) => {
      client.emit(DRAWING_EVENT.DRAWING, point);
    });
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
