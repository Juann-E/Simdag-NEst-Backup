import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ===================================================
  // ===== TAMBAHKAN BARIS INI UNTUK MENGIZINKAN KONEKSI DARI FRONTEND =====
  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend development
      'http://localhost:3000', // Local testing
      'https://your-frontend-domain.com' // Production (replace with actual domain)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
  // ===================================================

  // validasi global DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      
    forbidNonWhitelisted: true, 
    transform: true,      
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();