import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from "dotenv";
import { AppModule } from './app.module';

config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Airdropper API')
    .setDescription('The Airdropper API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const AppListenOn = process.env.APP_PORT || 3000;
  await app.listen(AppListenOn);
}
bootstrap();
