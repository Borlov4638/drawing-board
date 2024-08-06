import {
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageEntity } from './entities/image.entity';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ImageEntity> {
    return this.imageService.addOne(file);
  }

  @Get(':id')
  async getImageMetadata(@Param('id') id: string): Promise<ImageEntity> {
    return await this.imageService.getOneById(id);
  }
}
