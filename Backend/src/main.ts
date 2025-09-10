import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend development
      'http://localhost:3000', // Local testing
      'https://simdag-salatiga-deploy.netlify.app', 
      'https://simdag-nest-backup-production.up.railway.app' // Production (replace with actual domain)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });


  // Add request logging middleware
  app.use((req, res, next) => {
    if (req.url.includes('/team-photos/member/')) {
      console.log(`\n=== INCOMING REQUEST ===`);
      console.log(`Method: ${req.method}`);
      console.log(`URL: ${req.url}`);
      console.log(`Headers:`, req.headers);
      console.log(`Body:`, req.body);
      console.log(`========================\n`);
    }
    next();
  });

  // validasi global DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      
    forbidNonWhitelisted: true, 
    transform: true,      
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();