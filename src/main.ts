import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { env } from './shared/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: true
  });

  await app
    .listen(env.app.port ?? 3000)
    .then(() => Logger.log(`App running at port ${env.app.port ?? 3000}`));
}
bootstrap();
