import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { DrawingHistoryRepository } from './drawing-history.repository';
import { DrawingPointMessage } from './types/drawing-brush.type';

@Injectable()
export class RoomService {
  roomDrawingHistory = new Map<string, Set<DrawingPointMessage>>();

  constructor(private drawingHistoryService: DrawingHistoryRepository) {}

  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    client.join(room);
    if (!this.roomDrawingHistory.has(room)) {
      const history = await this.drawingHistoryService.getHistory(room);
      this.roomDrawingHistory.set(room, new Set<DrawingPointMessage>(history));
    }
  }

  handleLeaveRoom(server: Server, client: Socket, room: string): void {
    client.leave(room);

    if (this.isRoomEmpty(server, room)) {
      this.roomDrawingHistory.delete(room);
    }
  }

  getRoomHistory(room: string): Set<DrawingPointMessage> | undefined {
    return this.roomDrawingHistory.get(room);
  }

  private isRoomEmpty(server: Server, room: string): boolean {
    const clientsInRoom = server.sockets.adapter.rooms.get(room);
    return !clientsInRoom || clientsInRoom.size === 0;
  }
}
