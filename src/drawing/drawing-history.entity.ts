import { ImageEntity } from 'src/images/entities/image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DrawingPointMessage } from './types/drawing-brush.type';

@Entity('drawing_history')
export class DrawingHistoryEntity {
  @PrimaryColumn('uuid', { name: 'image_id' })
  imageId: string;

  @Column('jsonb')
  history: Array<DrawingPointMessage>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => ImageEntity, (image) => image.drawingHistories)
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;
}
