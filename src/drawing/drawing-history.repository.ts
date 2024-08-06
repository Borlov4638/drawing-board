import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { DrawingHistoryEntity } from './drawing-history.entity';
import { DrawingPointMessage } from './types/drawing-brush.type';

@Injectable()
export class DrawingHistoryRepository {
  constructor(private entityManager: EntityManager) {}

  async saveHistory(
    data: Set<DrawingPointMessage>,
    imageId: string,
  ): Promise<DrawingHistoryEntity> {
    const entity = this.entityManager.create(DrawingHistoryEntity, {
      history: Array.from(data),
      imageId,
    });

    return this.entityManager.save<DrawingHistoryEntity>(entity);
  }

  async getHistory(imageId: string): Promise<Set<DrawingPointMessage>> {
    const entity = await this.entityManager.findOne(DrawingHistoryEntity, {
      where: { imageId },
    });

    const historySet = new Set(entity?.history);
    return historySet;
  }
}
