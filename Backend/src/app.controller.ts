import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard) // Proteksi pakai JWT
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Contoh route publik tanpa JWT
  @Get('public')
  getPublic(): string {
    return 'Ini halaman publik, tidak butuh token JWT.';
  }
}
