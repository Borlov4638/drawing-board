import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { DRAWING_EVENT } from './constants';
import { RoomService } from './room.service';
import { DrawingDataType } from './types/drawing-data.type';

@Injectable()
export class DrawingService {
  constructor(private roomService: RoomService) {}

  handleDrawing(client: Socket, data: DrawingDataType): void {
    client.broadcast.to(data.room).emit(DRAWING_EVENT.DRAWING, data.point);
    const drawingHistory = this.roomService.getRoomHistory(data.room);
    if (drawingHistory) {
      drawingHistory.add(data.point);
    }
  }

  getRoomHistory(client: Socket, room: string): void {
    const drawingHistory = this.roomService.getRoomHistory(room);
    if (drawingHistory) {
      drawingHistory.forEach((point) => {
        client.emit(DRAWING_EVENT.DRAWING, point);
      });
    }
  }
}
