import {
  Controller, Get, Post, Body, Patch, Delete, Param,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TeamPhotoService } from './team-photo.service';
import { CreateTeamPhotoDto } from './dto/create-team-photo.dto';
import { UpdateTeamPhotoDto } from './dto/update-team-photo.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('team-photos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamPhotoController {
  constructor(private readonly teamPhotoService: TeamPhotoService) {}

  @Post()
  @Roles(UserRole.ADMIN) // hanya admin
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Hanya file gambar yang diizinkan!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  create(@Body() dto: CreateTeamPhotoDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      dto.photo = file.path; // tambahkan path file ke DTO
    }
    return this.teamPhotoService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.teamPhotoService.findAll();
  }

  @Get('member/:memberId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByMemberId(@Param('memberId') memberId: string) {
    return this.teamPhotoService.findByMemberId(memberId);
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAllActive() {
    return this.teamPhotoService.findActive();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.teamPhotoService.findOne(+id);
  }



  @Patch(':id')
  @Roles(UserRole.ADMIN) // hanya admin
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Hanya file gambar yang diizinkan!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  update(@Param('id') id: string, @Body() dto: UpdateTeamPhotoDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      dto.photo = file.path;
    }
    return this.teamPhotoService.update(+id, dto);
  }

  @Patch('member/:memberId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async updateByMemberId(
    @Param('memberId') memberId: string,
    @Body() updateTeamPhotoDto: UpdateTeamPhotoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      console.log('DEBUG - updateByMemberId called with:');
      console.log('memberId:', memberId);
      console.log('updateTeamPhotoDto:', updateTeamPhotoDto);
      console.log('file:', file ? { filename: file.filename, path: file.path, size: file.size } : 'No file');
      return this.teamPhotoService.updateByMemberId(memberId, updateTeamPhotoDto, file);
    } catch (error) {
      console.error('ERROR in updateByMemberId:', error);
      throw error;
    }
  }

  @Patch('upload/:member_id')
  @Roles(UserRole.ADMIN) // hanya admin
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Hanya file gambar yang diizinkan!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  uploadPhoto(@Param('member_id') member_id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File foto harus disertakan');
    }
    return this.teamPhotoService.updatePhoto(member_id, file.path);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.teamPhotoService.remove(+id);
  }

  @Delete('member/:memberId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removeByMemberId(@Param('memberId') memberId: string) {
    return this.teamPhotoService.removeByMemberId(memberId);
  }
}