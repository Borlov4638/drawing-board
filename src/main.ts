import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const host = configService.get('APP_HOST', '0.0.0.0');
  const port = configService.get('APP_PORT', 3000);
  const logger = new Logger('bootstrap');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.listen(port);
  logger.log(`Nest application successfully started on ${host}:${port}`);
}
bootstrap();
