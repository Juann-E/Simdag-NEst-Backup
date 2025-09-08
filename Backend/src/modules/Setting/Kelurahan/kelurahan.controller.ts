import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe, BadRequestException
} from '@nestjs/common';
import { KelurahanService } from './kelurahan.service';
import { CreateKelurahanDto } from './dto/create-kelurahan.dto';
import { UpdateKelurahanDto } from './dto/update-kelurahan.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('kelurahan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KelurahanController {
  constructor(private readonly kelurahanService: KelurahanService) {}

  // CREATE
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateKelurahanDto) {
    return this.kelurahanService.create(dto);
  }

  // READ: all, by id_kelurahan, or by id_kecamatan
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAllOrFiltered(
    @Query('id_kelurahan') idKelurahan?: number,
    @Query('id_kecamatan') idKecamatan?: number,
    @Body('id_kelurahan') bodyIdKelurahan?: number,
    @Body('id_kecamatan') bodyIdKecamatan?: number,
  ) {
    const finalIdKelurahan = idKelurahan ?? bodyIdKelurahan;
    const finalIdKecamatan = idKecamatan ?? bodyIdKecamatan;

    if (finalIdKelurahan) {
      return this.kelurahanService.findOne(+finalIdKelurahan);
    }

    if (finalIdKecamatan) {
      return this.kelurahanService.findByKecamatan(+finalIdKecamatan);
    }

    return this.kelurahanService.findAll();
  }

  // GET kelurahan by kecamatan ID via URL parameter
  @Get('kecamatan/:id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findByKecamatanParam(@Param('id', ParseIntPipe) id: number) {
    return this.kelurahanService.findByKecamatan(id);
  }

  // UPDATE via URL
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  updateByUrl(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateKelurahanDto) {
    return this.kelurahanService.update(id, dto);
  }

  // UPDATE via Body
  @Patch()
  @Roles(UserRole.ADMIN)
  updateByBody(@Body() dto: UpdateKelurahanDto & { id_kelurahan: number }) {
    if (!dto.id_kelurahan) {
      throw new BadRequestException('id_kelurahan harus disertakan dalam body');
    }
    return this.kelurahanService.update(dto.id_kelurahan, dto);
  }

  // DELETE via URL
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  removeByUrl(@Param('id', ParseIntPipe) id: number) {
    return this.kelurahanService.remove(id);
  }

  // DELETE via Body
  @Delete()
  @Roles(UserRole.ADMIN)
  removeByBody(@Body('id_kelurahan', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException('id_kelurahan harus disertakan dalam body');
    }
    return this.kelurahanService.remove(id);
  }
}
