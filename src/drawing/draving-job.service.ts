import { Cron, CronExpression } from '@nestjs/schedule';
import { DrawingGateway } from './drawing.gateway';
import { Injectable } from '@nestjs/common';
import { DrawingHistoryRepository } from './drawing-history.repository';

@Injectable()
export class DrawingJobService {
  constructor(
    private drawingGateway: DrawingGateway,
    private drawingHistoryRepository: DrawingHistoryRepository,
  ) {}
  //TODO: сделать так чтобы job не наслаивались job.stop()/start()
  @Cron(CronExpression.EVERY_SECOND)
  saveDrawingHisrory() {
    const drawingHistory = this.drawingGateway.roomDrawingHistory;

    drawingHistory.forEach((drawingPointHistory, room) => {
      this.drawingHistoryRepository.saveHistory(drawingPointHistory, room);
    });
  }
}
