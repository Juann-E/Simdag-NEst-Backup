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
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TransaksiStockPanganService } from './transaksi-stock-pangan.service';
import { CreateTransaksiStockPanganDto } from './dto/create-transaksi-stock-pangan.dto';
import { UpdateTransaksiStockPanganDto } from './dto/update-transaksi-stock-pangan.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('transaksi-stock-pangan')
@UseGuards(JwtAuthGuard)
export class TransaksiStockPanganController {
  constructor(private readonly transaksiStockPanganService: TransaksiStockPanganService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTransaksiStockPanganDto: CreateTransaksiStockPanganDto) {
    return this.transaksiStockPanganService.create(createTransaksiStockPanganDto);
  }

  @Get()
  findAll(
    @Query('tahun') tahun?: string,
    @Query('bulan') bulan?: string,
    @Query('distributor') distributor?: string,
    @Query('komoditas') komoditas?: string,
  ) {
    if (tahun && bulan) {
      return this.transaksiStockPanganService.findByTahunBulan(
        parseInt(tahun),
        parseInt(bulan),
      );
    }
    
    if (distributor) {
      return this.transaksiStockPanganService.findByDistributor(parseInt(distributor));
    }
    
    if (komoditas) {
      return this.transaksiStockPanganService.findByKomoditas(parseInt(komoditas));
    }
    
    return this.transaksiStockPanganService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transaksiStockPanganService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransaksiStockPanganDto: UpdateTransaksiStockPanganDto,
  ) {
    return this.transaksiStockPanganService.update(id, updateTransaksiStockPanganDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transaksiStockPanganService.remove(id);
  }
}