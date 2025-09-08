import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { SatuanBarangService } from './satuan-barang.service';
import { CreateSatuanBarangDto } from './dto/create-satuan-barang.dto';
import { UpdateSatuanBarangDto } from './dto/update-satuan-barang.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('satuan-barang')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SatuanBarangController {
  constructor(private readonly satuanBarangService: SatuanBarangService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateSatuanBarangDto) {
    return this.satuanBarangService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.satuanBarangService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() dto: UpdateSatuanBarangDto) {
    return this.satuanBarangService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.satuanBarangService.remove(+id);
  }
}
