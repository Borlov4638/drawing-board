import { DrawingHistoryEntity } from 'src/drawing/drawing-history.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  name: string;

  @Column('character varying', { name: 'mime_type' })
  mimeType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => DrawingHistoryEntity, (dh) => dh.image)
  drawingHistories: DrawingHistoryEntity;
}
