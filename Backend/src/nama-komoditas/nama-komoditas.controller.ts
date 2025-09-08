import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NamaKomoditasService } from './nama-komoditas.service';
import { CreateNamaKomoditasDto } from './dto/create-nama-komoditas.dto';
import { UpdateNamaKomoditasDto } from './dto/update-nama-komoditas.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('nama-komoditas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class NamaKomoditasController {
  constructor(private readonly namaKomoditasService: NamaKomoditasService) {}

  @Post()
  create(@Body() createNamaKomoditasDto: CreateNamaKomoditasDto) {
    return this.namaKomoditasService.create(createNamaKomoditasDto);
  }

  @Get()
  findAll() {
    return this.namaKomoditasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.namaKomoditasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNamaKomoditasDto: UpdateNamaKomoditasDto,
  ) {
    return this.namaKomoditasService.update(id, updateNamaKomoditasDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.namaKomoditasService.remove(id);
  }
}