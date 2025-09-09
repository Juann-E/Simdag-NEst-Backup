// backend/src/modules/public/public.controller.ts

import { Controller, Get, Param, Query, Res, Post, Patch, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';
import { PublicService } from './public.service';
import { Public } from '../decorators/public.decorator';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Public()
  @Get('markets')
  findAllMarkets() {
    return this.publicService.findAllMarkets();
  }

  @Public()
  @Get('items')
  findAllItems() {
    return this.publicService.findAllItems();
  }

  @Public()
  @Get('prices/all')
  findAllPrices() {
    return this.publicService.findAllPrices();
  }

  @Public()
  @Get('prices/market/:marketId')
  findPricesForMarket(@Param('marketId') marketId: number) {
    return this.publicService.findPricesForMarket(+marketId);
  }

  @Public()
  @Get('prices/market/:marketId/dates')
  findPricesForMarketByDates(
    @Param('marketId') marketId: number,
    @Query('firstDate') firstDate: string,
    @Query('secondDate') secondDate: string
  ) {
    return this.publicService.findPricesForMarketByDates(+marketId, firstDate, secondDate);
  }

  @Public()
  @Get('chart-data')
  getChartData(
    @Query('marketId') marketId?: string,
    @Query('itemId') itemId?: string
  ) {
    // Jika itemId disediakan, gunakan chart untuk komoditas tertentu
    if (itemId) {
      const parsedItemId = +itemId;
      const parsedMarketId = marketId ? +marketId : undefined;
      return this.publicService.getChartDataForCommodity(parsedItemId, parsedMarketId);
    }
    
    // Jika hanya marketId disediakan, gunakan chart untuk pasar tertentu
    if (marketId) {
      return this.publicService.getChartDataForMarket(+marketId);
    }
    
    // Default: chart untuk semua data
    return this.publicService.getChartData();
  }

  @Public()
  @Get('locations')
  getAllLocations() {
    return this.publicService.getAllLocations();
  }

  @Public()
  @Get('dashboard-stats')
  getDashboardStats() {
    return this.publicService.getDashboardStats();
  }

  @Public()
  @Get('stock-pangan-stats')
  getStockPanganStats() {
    return this.publicService.getStockPanganStats();
  }

  @Public()
  @Get('stock-pangan-chart-data')
  getStockPanganChartData(
    @Query('distributorId') distributorId?: string,
    @Query('komoditasId') komoditasId?: string
  ) {
    const parsedDistributorId = distributorId ? +distributorId : undefined;
    const parsedKomoditasId = komoditasId ? +komoditasId : undefined;
    return this.publicService.getStockPanganChartData(parsedDistributorId, parsedKomoditasId);
  }

  @Public()
  @Get('distributors')
  findAllDistributors() {
    return this.publicService.findAllDistributors();
  }

  @Public()
  @Get('distributor/:distributorId/stock-monthly')
  getDistributorStockMonthly(@Param('distributorId') distributorId: number) {
    return this.publicService.getDistributorStockMonthly(+distributorId);
  }

  @Public()
  @Get('agen')
  findAllAgen() {
    return this.publicService.findAllAgen();
  }

  @Public()
  @Get('realisasi-bulanan-lpg')
  findAllRealisasiBulananLpg() {
    return this.publicService.findAllRealisasiBulananLpg();
  }

  @Public()
  @Get('realisasi-bulanan-lpg/:id')
  findOneRealisasiBulananLpg(@Param('id') id: number) {
    return this.publicService.findOneRealisasiBulananLpg(+id);
  }

  @Public()
  @Get('spbu')
  findAllSpbu() {
    return this.publicService.findAllSpbu();
  }

  @Public()
  @Get('realisasi-bulanan-bbm')
  findAllRealisasiBulananBbm() {
    return this.publicService.findAllRealisasiBulananBbm();
  }

  @Public()
  @Get('realisasi-bulanan-bbm/spbu/:spbuId')
  findRealisasiBulananBbmBySpbu(@Param('spbuId') spbuId: number) {
    return this.publicService.findRealisasiBulananBbmBySpbu(+spbuId);
  }

  @Public()
  @Get('lpg-chart-data')
  getLpgChartData(
    @Query('year') year?: string,
    @Query('agenId') agenId?: string
  ) {
    const yearNum = year ? parseInt(year) : undefined;
    const agenIdNum = agenId ? parseInt(agenId) : undefined;
    return this.publicService.getLpgChartData(yearNum, agenIdNum);
  }

  @Public()
  @Get('bbm-chart-data')
  getBbmChartData(
    @Query('year') year?: string,
    @Query('spbuId') spbuId?: string
  ) {
    const yearNum = year ? parseInt(year) : undefined;
    const spbuIdNum = spbuId ? parseInt(spbuId) : undefined;
    return this.publicService.getBbmChartData(yearNum, spbuIdNum);
  }

  @Public()
  @Get('jenis-bbm')
  findAllJenisBbm() {
    return this.publicService.findAllJenisBbm();
  }

  @Public()
  @Get('komoditas-stock-pangan')
  findAllKomoditasStockPangan() {
    return this.publicService.findAllKomoditasStockPangan();
  }

  @Public()
  @Get('team-photos')
  findAllTeamPhotos() {
    return this.publicService.findAllTeamPhotos();
  }

  @Public()
  @Get('team-photos/active')
  findActiveTeamPhotos() {
    return this.publicService.findActiveTeamPhotos();
  }

  @Public()
  @Patch('team-photos/member/:memberId')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/team-photos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  updateTeamPhotoMember(
    @Param('memberId') memberId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateData: any,
  ) {
    return this.publicService.updateTeamPhotoMember(memberId, file, updateData);
  }
}