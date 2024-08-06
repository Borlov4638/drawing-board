import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_ERRORS } from './constants';

@Injectable()
export class ImageS3Repository {
  private logger = new Logger(ImageS3Repository.name);

  private s3 = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_REGION'),
    endpoint: this.configService.getOrThrow<string>('AWS_CLOUD_URL'),
  });

  constructor(private configService: ConfigService) {}

  async uploadOne(key: string, data: Buffer): Promise<PutObjectCommandOutput> {
    return this.s3
      .send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow<string>(
            'AWS_IMAGE_BUCKET_NAME',
          ),
          Key: key,
          Body: data,
        }),
      )
      .catch((error) => {
        this.logger.error(AWS_ERRORS.IMAGE_UPLOAD, error);
        throw new BadRequestException(error);
      });
  }
}
