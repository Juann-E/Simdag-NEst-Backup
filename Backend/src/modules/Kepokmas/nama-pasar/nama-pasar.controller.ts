import {
  Controller, Get, Post, Body, Patch, Delete, Param,
  UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NamaPasarService } from './nama-pasar.service';
import { CreateNamaPasarDto } from './dto/create-nama-pasar.dto';
import { UpdateNamaPasarDto } from './dto/update-nama-pasar.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('nama-pasar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NamaPasarController {
  constructor(private readonly namaPasarService: NamaPasarService) {}

  @Post()
  @Roles(UserRole.ADMIN) // hanya admin
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/pasar',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  create(@Body() dto: CreateNamaPasarDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) dto.gambar = file.path; // tambahkan path file ke DTO
    return this.namaPasarService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.namaPasarService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN) // hanya admin
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/pasar',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  update(@Param('id') id: number, @Body() dto: UpdateNamaPasarDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) dto.gambar = file.path;
    return this.namaPasarService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.namaPasarService.remove(+id);
  }
}
