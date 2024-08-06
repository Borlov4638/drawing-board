import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { DrawingHistoryRepository } from './drawing-history.repository';
import { RoomService } from './room.service';

@Injectable()
export class DrawingJobService {
  constructor(
    private roomService: RoomService,
    private drawingHistoryRepository: DrawingHistoryRepository,
  ) {}
  //TODO: сделать так чтобы job не наслаивались job.stop()/start()
  @Cron(CronExpression.EVERY_SECOND)
  async saveDrawingHisrory(): Promise<void> {
    const drawingHistory = this.roomService.roomDrawingHistory;

    drawingHistory.forEach(async (drawingPointHistory, room) => {
      await this.drawingHistoryRepository.saveHistory(
        drawingPointHistory,
        room,
      );
    });
  }
}
