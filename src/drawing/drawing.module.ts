import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DrawingJobService } from './draving-job.service';
import { DrawingGateway } from './drawing.gateway';
import { DrawingService } from './drawing.service';
import { DrawingHistoryEntity } from './drawing-history.entity';
import { DrawingHistoryRepository } from './drawing-history.repository';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([DrawingHistoryEntity])],
  providers: [
    DrawingGateway,
    DrawingHistoryRepository,
    DrawingJobService,
    DrawingService,
    RoomService,
  ],
})
export class DrawingModule {}
