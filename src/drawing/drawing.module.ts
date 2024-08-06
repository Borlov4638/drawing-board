import { Module } from '@nestjs/common';
import { DrawingGateway } from './drawing.gateway';
import { DrawingHistoryRepository } from './drawing-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawingHistoryEntity } from './drawing-history.entity';
import { DrawingJobService } from './draving-job.service';

@Module({
  imports: [TypeOrmModule.forFeature([DrawingHistoryEntity])],
  providers: [DrawingGateway, DrawingHistoryRepository, DrawingJobService],
})
export class DrawingModule {}
