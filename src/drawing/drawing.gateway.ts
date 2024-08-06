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

import { DRAWING_EVENT } from './constants';
import { DrawingService } from './drawing.service';
import { RoomService } from './room.service';
import { DrawingDataType } from './types/drawing-data.type';

@WebSocketGateway({ cors: '*:*' })
export class DrawingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger = new Logger(DrawingGateway.name);

  constructor(
    private roomService: RoomService,
    private drawingService: DrawingService,
  ) {}

  @SubscribeMessage(DRAWING_EVENT.DRAWING)
  handleDrawing(client: Socket, data: DrawingDataType): void {
    this.drawingService.handleDrawing(client, data);
  }

  @SubscribeMessage(DRAWING_EVENT.JOIN_ROOM)
  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    await this.roomService.handleJoinRoom(client, room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage(DRAWING_EVENT.LEAVE_ROOM)
  handleLeaveRoom(client: Socket, room: string): void {
    this.roomService.handleLeaveRoom(this.server, client, room);
    this.logger.log(`Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage(DRAWING_EVENT.GET_HISTORY)
  getRoomHistory(client: Socket, room: string): void {
    this.drawingService.getRoomHistory(client, room);
  }

  afterInit(server: Server): void {
    this.logger.log(`WebSocket ${server.engine}server initialized`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
