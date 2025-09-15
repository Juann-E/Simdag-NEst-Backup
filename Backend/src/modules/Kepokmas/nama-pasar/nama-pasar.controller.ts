import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
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
  constructor(
    private readonly namaPasarService: NamaPasarService
  ) {}

  @Post()
  @Roles(UserRole.ADMIN) // hanya admin
  @UseInterceptors(FileInterceptor('gambar', {
    storage: diskStorage({
      destination: './uploads/pasar',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    })
  }))
  async create(@Body() dto: CreateNamaPasarDto, @UploadedFile() file?: Express.Multer.File) {
    try {
      console.log('=== CREATE NAMA PASAR ===');
      console.log('DTO received:', dto);
      console.log('File received:', file ? { filename: file.filename, path: file.path, size: file.size } : 'No file');
      
      if (file) {
        dto.gambar = file.path;
      }
      
      const result = await this.namaPasarService.create(dto);
      console.log('Create result:', result);
      return result;
    } catch (error) {
      console.error('Error in create nama pasar:', error);
      throw error;
    }
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
    })
  }))
  async update(@Param('id') id: string, @Body() dto: UpdateNamaPasarDto, @UploadedFile() file?: Express.Multer.File) {
    try {
      console.log('=== UPDATE NAMA PASAR ===');
      console.log('ID:', id);
      console.log('DTO received:', dto);
      console.log('File received:', file ? { filename: file.filename, path: file.path, size: file.size } : 'No file');
      
      if (file) {
        dto.gambar = file.path;
      }
      
      const result = await this.namaPasarService.update(+id, dto);
      console.log('Update result:', result);
      return result;
    } catch (error) {
      console.error('Error in update nama pasar:', error);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.namaPasarService.remove(+id);
  }
}
