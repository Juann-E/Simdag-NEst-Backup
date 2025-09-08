import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { KomoditasStockPanganService } from './komoditas.service';
import { CreateKomoditasDto } from './dto/create-komoditas.dto';
import { UpdateKomoditasDto } from './dto/update-komoditas.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('komoditas-stock-pangan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KomoditasStockPanganController {
  constructor(private readonly komoditasService: KomoditasStockPanganService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/komoditas',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `komoditas-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() dto: CreateKomoditasDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) dto.gambar = file.path;
    return this.komoditasService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.komoditasService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findOne(@Param('id') id: number) {
    return this.komoditasService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/komoditas',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `komoditas-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  update(@Param('id') id: number, @Body() dto: UpdateKomoditasDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) dto.gambar = file.path;
    return this.komoditasService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.komoditasService.remove(+id);
  }
}