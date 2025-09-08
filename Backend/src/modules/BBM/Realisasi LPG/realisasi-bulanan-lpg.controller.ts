import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { RealisasiBulananLpgService } from './realisasi-bulanan-lpg.service';
import { CreateRealisasiBulananLpgDto } from './dto/create-realisasi-bulanan-lpg.dto';
import { UpdateRealisasiBulananLpgDto } from './dto/update-realisasi-bulanan-lpg.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

import { UserRole } from '../../../common/enums/user-role.enum';


@Controller('realisasi-bulanan-lpg')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RealisasiBulananLpgController {
  constructor(private readonly realisasiBulananLpgService: RealisasiBulananLpgService) {}

  // CREATE
  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body() createDto: CreateRealisasiBulananLpgDto) {
    return this.realisasiBulananLpgService.create(createDto);
  }

  // READ ALL or ONE by Query
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAllOrOne(
    @Query('id_realisasi_lpg') idRealisasi?: number,
    @Query('id_agen') idAgen?: number,
    @Query('tahun') tahun?: number,
    @Query('bulan') bulan?: number,
  ) {
    if (idRealisasi) {
      return this.realisasiBulananLpgService.findOne(+idRealisasi);
    }
    
    if (idAgen) {
      return this.realisasiBulananLpgService.findByAgen(+idAgen);
    }
    
    if (tahun) {
      return this.realisasiBulananLpgService.findByPeriod(+tahun, bulan ? +bulan : undefined);
    }
    
    return this.realisasiBulananLpgService.findAll();
  }

  // READ ONE by Body JSON
  @Post('find')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findOneByBody(@Body('id_realisasi_lpg', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException('id_realisasi_lpg harus disertakan dalam body');
    }
    return this.realisasiBulananLpgService.findOne(id);
  }

  // READ by Agen via Body JSON
  @Post('find-by-agen')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByAgenBody(@Body('id_agen', ParseIntPipe) idAgen: number) {
    if (!idAgen) {
      throw new BadRequestException('id_agen harus disertakan dalam body');
    }
    return this.realisasiBulananLpgService.findByAgen(idAgen);
  }

  // READ by Period via Body JSON
  @Post('find-by-period')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByPeriodBody(
    @Body() body: { tahun: number; bulan?: number },
  ) {
    if (!body.tahun) {
      throw new BadRequestException('tahun harus disertakan dalam body');
    }
    return this.realisasiBulananLpgService.findByPeriod(body.tahun, body.bulan);
  }

  // UPDATE via URL param
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  updateByUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRealisasiBulananLpgDto,
  ) {
    return this.realisasiBulananLpgService.update(id, updateDto);
  }

  // UPDATE via Body JSON
  @Patch()
  @Roles(UserRole.ADMIN)
  updateByBody(
    @Body() updateDto: UpdateRealisasiBulananLpgDto & { id_realisasi_lpg: number },
  ) {
    if (!updateDto.id_realisasi_lpg) {
      throw new BadRequestException('id_realisasi_lpg harus disertakan dalam body');
    }
    return this.realisasiBulananLpgService.update(updateDto.id_realisasi_lpg, updateDto);
  }

  // DELETE via URL param
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  removeByUrl(@Param('id', ParseIntPipe) id: number) {
    return this.realisasiBulananLpgService.remove(id);
  }

  // DELETE via Body JSON
  @Delete()
  @Roles(UserRole.ADMIN)
  removeByBody(@Body('id_realisasi_lpg', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException('id_realisasi_lpg harus disertakan dalam body');
    }
    return this.realisasiBulananLpgService.remove(id);
  }
}