import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DrawingHistoryEntity } from 'src/drawing/drawing-history.entity';
import { ImageEntity } from 'src/images/entities/image.entity';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      host: this.configService.get('TYPEORM_HOST'),
      port: this.configService.get('TYPEORM_PORT'),
      username: this.configService.get('TYPEORM_USERNAME'),
      password: this.configService.get('TYPEORM_PASSWORD'),
      database: this.configService.get('TYPEORM_DATABASE'),
      type: 'postgres',
      synchronize: false,
      installExtensions: true,
      migrationsRun: true,
      migrations: [this.configService.get('TYPEORM_MIGRATIONS')],
      entities: entities,
    };
  }
}

const entities = [ImageEntity, DrawingHistoryEntity];
