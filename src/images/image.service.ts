import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ImageEntityRepository } from './image.repository';
import { ImageEntity } from './entities/image.entity';
import { ImageS3Repository } from './image-s3.repository';
import { METADATA_ERRORS } from './constants';
import { EntityManager } from 'typeorm';

@Injectable()
export class ImageService {
  private logger = new Logger(ImageService.name);
  constructor(
    private imageEntityRepository: ImageEntityRepository,
    private imageS3Repository: ImageS3Repository,
    private entityManager: EntityManager,
  ) {}

  async addOne(file: Express.Multer.File): Promise<ImageEntity> {
    const { buffer, mimetype, originalname } = file;

    return await this.entityManager.transaction(
      async (entityManager: EntityManager) => {
        const image = entityManager.create(ImageEntity, {
          mimeType: mimetype,
          name: originalname,
        });
        const imageMetadata = await entityManager
          .save<ImageEntity>(image)
          .catch((error) => {
            this.logger.error(METADATA_ERRORS.IMAGE_CREATION, error);
            throw new BadRequestException(METADATA_ERRORS.IMAGE_CREATION);
          });

        await this.imageS3Repository.uploadOne(
          imageMetadata.id.toString(),
          buffer,
        );
        return imageMetadata;
      },
    );
  }

  async getOneById(id: string): Promise<ImageEntity> {
    const entity = await this.imageEntityRepository.getOneById(id);

    if (!entity) {
      throw new NotFoundException(METADATA_ERRORS.IMAGE_NOT_FOUND);
    }
    return entity;
  }
}
