import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, ParseIntPipe
} from '@nestjs/common';
import { KecamatanService } from './kecamatan.service';
import { CreateKecamatanDto } from './dto/create-kecamatan.dto';
import { UpdateKecamatanDto } from './dto/update-kecamatan.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('kecamatan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KecamatanController {
  constructor(private readonly kecamatanService: KecamatanService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateKecamatanDto) {
    return this.kecamatanService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAllOrFiltered(
    @Body('id_kecamatan') bodyId?: number,
    @Body('id') bodyAltId?: number, // antisipasi kalau body pakai key "id"
    @Param('id') paramId?: number,
  ) {
    const finalId = bodyId ?? bodyAltId ?? paramId;

    if (finalId) {
      return this.kecamatanService.findOne(+finalId);
    }

    return this.kecamatanService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findOneByParam(@Param('id', ParseIntPipe) id: number) {
    return this.kecamatanService.findOne(id);
  }

  @Post('findOne')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findOneByBody(@Body('id_kecamatan', ParseIntPipe) id: number) {
    return this.kecamatanService.findOne(id);
  }


  // PATCH via URL
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  updateByParam(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateKecamatanDto) {
    return this.kecamatanService.update(id, dto);
  }

  // PATCH via Body JSON 
  @Patch()
  @Roles(UserRole.ADMIN)
  updateByBody(@Body() dto: UpdateKecamatanDto & { id_kecamatan: number }) {
    if (!dto.id_kecamatan) {
      throw new Error('id_kecamatan harus disertakan dalam body');
    }
    return this.kecamatanService.update(dto.id_kecamatan, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kecamatanService.remove(id);
  }
}
