import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './images/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigService } from './config/pg.config';
import { DrawingModule } from './drawing/drawing.module';
import { ScheduleModule } from '@nestjs/schedule';

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
