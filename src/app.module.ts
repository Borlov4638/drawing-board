import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeormConfigService } from './config/pg.config';
import { DrawingModule } from './drawing/drawing.module';
import { ImageModule } from './images/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ImageModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      inject: [TypeormConfigService],
      imports: [ConfigModule, ImageModule, DrawingModule],
    }),
    ScheduleModule.forRoot({}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
