import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpLoggingInterceptor } from './interceptors/http-logging.interceptor';
import { AppLogger } from './logger/logger.service';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置静态文件服务
  app.use(
    '/public',
    express.static(path.join(__dirname, '..', 'public'), {
      maxAge: 31557600000, // 1 year
    }),
  );

  app.useGlobalInterceptors(new HttpLoggingInterceptor(app.get(AppLogger)));

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://192.168.31.44:8080',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Dictate English API')
    .setDescription('API for the Dictate English Fullstack Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000, process.env.HOST || '0.0.0.0');
}
bootstrap();
