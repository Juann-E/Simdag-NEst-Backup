import {
  Controller, Get, Post, Body, Param, Delete, Put,
  UseGuards, BadRequestException
} from '@nestjs/common';
import { HargaBarangPasarService } from './harga-barang-pasar.service';
import { CreateHargaBarangPasarDto } from './dto/create-harga-barang-pasar.dto';
import { UpdateHargaBarangPasarDto } from './dto/update-harga-barang-pasar.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('harga-barang-pasar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HargaBarangPasarController {
  constructor(private readonly hargaService: HargaBarangPasarService) {}

  // CREATE
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateHargaBarangPasarDto) {
    return this.hargaService.create(dto);
  }

  // READ (all)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll() {
    return this.hargaService.findAll();
  }

  // FILTER (by id_harga / id_barang_pasar)
  @Post('filter')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async filter(
    @Body('id_harga') id_harga?: number,
    @Body('id_barang_pasar') id_barang_pasar?: number,
  ) {
    return this.hargaService.filter({ id_harga, id_barang_pasar });
  }

  // READ (one by id)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findOne(@Param('id') id: number) {
    return this.hargaService.findOne(+id);
  }

  // UPDATE (id di URL)
  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateByUrl(@Param('id') id: number, @Body() dto: UpdateHargaBarangPasarDto) {
    return this.hargaService.update(+id, dto);
  }

  // UPDATE (id di body)
  @Put()
  @Roles(UserRole.ADMIN)
  async updateByBody(
    @Body('id_harga') id: number,
    @Body() dto: UpdateHargaBarangPasarDto,
  ) {
    if (!id) throw new BadRequestException('id_harga harus ada di body');
    return this.hargaService.update(+id, dto);
  }

  // DELETE (id di URL)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async removeByUrl(@Param('id') id: number) {
    return this.hargaService.remove(+id);
  }

  // DELETE (id di body)
  @Delete()
  @Roles(UserRole.ADMIN)
  async removeByBody(@Body('id_harga') id: number) {
    if (!id) throw new BadRequestException('id_harga harus ada di body');
    return this.hargaService.remove(+id);
  }
}
