import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RealisasiBulananBbmService } from './realisasi-bulanan-bbm.service';
import { CreateRealisasiBulananBbmDto } from './dto/create-realisasi-bulanan-bbm.dto';
import { UpdateRealisasiBulananBbmDto } from './dto/update-realisasi-bulanan-bbm.dto';
import { RealisasiBulananBbm } from './realisasi-bulanan-bbm.entity';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('realisasi-bulanan-bbm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RealisasiBulananBbmController {
  constructor(private readonly realisasiBulananBbmService: RealisasiBulananBbmService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createRealisasiBulananBbmDto: CreateRealisasiBulananBbmDto): Promise<RealisasiBulananBbm> {
    return this.realisasiBulananBbmService.create(createRealisasiBulananBbmDto);
  }

  @Get()
  async findAll(): Promise<RealisasiBulananBbm[]> {
    return this.realisasiBulananBbmService.findAll();
  }

  @Get('spbu/:id')
  async findBySpbu(@Param('id', ParseIntPipe) id_spbu: number): Promise<RealisasiBulananBbm[]> {
    return this.realisasiBulananBbmService.findBySpbu(id_spbu);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RealisasiBulananBbm> {
    return this.realisasiBulananBbmService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRealisasiBulananBbmDto: UpdateRealisasiBulananBbmDto,
  ): Promise<RealisasiBulananBbm> {
    return this.realisasiBulananBbmService.update(id, updateRealisasiBulananBbmDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.realisasiBulananBbmService.remove(id);
  }
}