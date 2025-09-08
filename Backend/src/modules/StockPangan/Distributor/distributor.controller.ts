import {
  Controller, Get, Post, Body, Patch, Delete, Param,
  UseGuards
} from '@nestjs/common';
import { DistributorService } from './distributor.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('distributor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createDistributorDto: CreateDistributorDto) {
    const distributor = await this.distributorService.create(createDistributorDto);
    const result = await this.distributorService.findOne(distributor.id);
    return {
      ...result,
      nama_kecamatan: result.kecamatan?.nama_kecamatan || '',
      nama_kelurahan: result.kelurahan?.nama_kelurahan || ''
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll() {
    const distributors = await this.distributorService.findAll();
    return distributors.map(distributor => ({
      ...distributor,
      nama_kecamatan: distributor.kecamatan?.nama_kecamatan || '',
      nama_kelurahan: distributor.kelurahan?.nama_kelurahan || ''
    }));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findOne(@Param('id') id: string) {
    const distributor = await this.distributorService.findOne(+id);
    return {
      ...distributor,
      nama_kecamatan: distributor.kecamatan?.nama_kecamatan || '',
      nama_kelurahan: distributor.kelurahan?.nama_kelurahan || ''
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() updateDistributorDto: UpdateDistributorDto) {
    await this.distributorService.update(+id, updateDistributorDto);
    const distributor = await this.distributorService.findOne(+id);
    return {
      ...distributor,
      nama_kecamatan: distributor.kecamatan?.nama_kecamatan || '',
      nama_kelurahan: distributor.kelurahan?.nama_kelurahan || ''
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.distributorService.remove(+id);
  }
}