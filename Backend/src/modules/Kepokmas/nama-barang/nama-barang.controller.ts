import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NamaBarangService } from './nama-barang.service';
import { CreateNamaBarangDto } from './dto/create-nama-barang.dto';
import { UpdateNamaBarangDto } from './dto/update-nama-barang.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('nama-barang')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NamaBarangController {
  constructor(private readonly namaBarangService: NamaBarangService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/barang',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  create(@Body() dto: CreateNamaBarangDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) dto.gambar = file.path;
    return this.namaBarangService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.namaBarangService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findOne(@Param('id') id: number) {
    return this.namaBarangService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/barang',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  update(@Param('id') id: number, @Body() dto: UpdateNamaBarangDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) dto.gambar = file.path;
    return this.namaBarangService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.namaBarangService.remove(+id);
  }
}
