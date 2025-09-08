import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, NotFoundException
} from '@nestjs/common';
import { BarangPasarGridService } from './barang-pasar-grid.service';
import { CreateBarangPasarGridDto } from './dto/create-barang-pasar.dto';
import { UpdateBarangPasarGridDto } from './dto/update-barang-pasar.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('barang-pasar-grid')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BarangPasarGridController {
  constructor(private readonly gridService: BarangPasarGridService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateBarangPasarGridDto) {
    return this.gridService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.gridService.findAll();
  }

  @Post('filter')
  async filter(
    @Body() body: { idPasar?: number; idBarang?: number } = {},
  ) {
    const { idPasar, idBarang } = body;

    if (idPasar === undefined && idBarang === undefined) {
      throw new NotFoundException(
        'Harus mengisi minimal idPasar atau idBarang',
      );
    }

    return this.gridService.filter(idPasar, idBarang);
  }

  // by Body (JSON)
  @Patch('update')
  @Roles(UserRole.ADMIN)
  updateByBody(@Body() body: { idPasar: number; idBarang: number; keterangan?: string }) {
    const { idPasar, idBarang, ...updateData } = body;
    return this.gridService.updateByPasarAndBarang(idPasar, idBarang, updateData);
  }
  // by URL param
  @Patch(':idPasar/:idBarang')
  @Roles(UserRole.ADMIN)
  updateByParam(
    @Param('idPasar') idPasar: number,
    @Param('idBarang') idBarang: number,
    @Body() dto: UpdateBarangPasarGridDto,
  ) {
    return this.gridService.updateByPasarAndBarang(+idPasar, +idBarang, dto);
  }

  //  by Body (JSON)
  @Delete('delete')
  @Roles(UserRole.ADMIN)
  deleteByBody(@Body() body: { idPasar: number; idBarang: number }) {
    const { idPasar, idBarang } = body;
    return this.gridService.removeByPasarAndBarang(idPasar, idBarang);
  }
  //  by URL param
  @Delete(':idPasar/:idBarang')
  @Roles(UserRole.ADMIN)
  deleteByParam(
    @Param('idPasar') idPasar: number,
    @Param('idBarang') idBarang: number,
  ) {
    return this.gridService.removeByPasarAndBarang(+idPasar, +idBarang);
  }
}
