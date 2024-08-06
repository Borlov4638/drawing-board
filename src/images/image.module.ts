import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImageEntityRepository } from './image.repository';
import { ImageS3Repository } from './image-s3.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImageController],
  providers: [ImageService, ImageEntityRepository, ImageS3Repository],
  exports: [],
})
export class ImageModule {}
