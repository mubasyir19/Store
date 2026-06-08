import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Local frontend
      'http://localhost:3001', // Docker frontend
      'https://your-frontend.com', // Production frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus properti yang tidak ada di DTO
      transform: true, // Otomatis mengubah tipe data jika diperlukan
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
