import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { METADATA_ERRORS } from './constants';
import { ImageEntity } from './entities/image.entity';

@Injectable()
export class ImageEntityRepository {
  private logger = new Logger(ImageEntityRepository.name);
  constructor(
    @InjectRepository(ImageEntity)
    private imageEntityRepository: Repository<ImageEntity>,
  ) {}

  async createOne(mimeType: string, name: string): Promise<ImageEntity> {
    return this.imageEntityRepository
      .save({ mimeType, name })
      .catch((error) => {
        this.logger.error(METADATA_ERRORS.IMAGE_CREATION, error);
        throw new BadRequestException('Something went Wrong');
      });
  }

  async getOneById(id: string): Promise<ImageEntity> {
    return this.imageEntityRepository.findOne({ where: { id } });
  }
}
