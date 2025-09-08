// report.controller.ts

import { Controller, Get, Post, Query, Body, Res, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { ReportService, ReportDto } from './report.service';

// Definisikan DTO untuk request body agar lebih rapi
interface ReportBodyDto {
  pasarId?: number[];
  namaPasar?: string; // Menerima nama pasar dari frontend
  barangId?: number[];
  start?: string;
  end?: string;
}

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // --- GET JSON (tidak berubah banyak) ---
  @Get()
  async getReportJson(@Query() query: ReportBodyDto) {
    const dto: ReportDto = {
      pasarIds: Array.isArray(query.pasarId) ? query.pasarId : (query.pasarId ? [query.pasarId] : []),
      barangIds: Array.isArray(query.barangId) ? query.barangId : (query.barangId ? [query.barangId] : []),
      start: query.start,
      end: query.end,
      // namaPasar tidak relevan untuk GET, service akan menanganinya
    };
    return this.reportService.generateJson(dto);
  }

  // --- POST JSON (diperbarui menggunakan DTO) ---
  @Post()
  async postReportJson(@Body() body: ReportBodyDto) {
    const dto: ReportDto = {
      pasarIds: body.pasarId || [],
      barangIds: body.barangId || [],
      namaPasar: body.namaPasar,
      start: body.start,
      end: body.end,
    };
    return this.reportService.generateJson(dto);
  }
  
  // --- POST EXCEL (diperbarui untuk menerima namaPasar) ---
  @Post('excel')
  async postReportExcel(@Body() body: ReportBodyDto, @Res() res: Response) {
    if (!res) throw new BadRequestException('Response object required');
    
    const dto: ReportDto = {
      pasarIds: body.pasarId || [],
      barangIds: body.barangId || [],
      namaPasar: body.namaPasar, // Meneruskan namaPasar
      start: body.start,
      end: body.end,
    };

    const { buffer, fileName } = await this.reportService.generateExcel(dto);

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.end(buffer);
  }

  // --- GET EXCEL (dihapus karena kompleksitas query string dan POST lebih umum dipakai) ---
  // Metode GET untuk Excel seringkali bermasalah dengan parameter array yang panjang.
  // Fokus pada metode POST yang sudah Anda gunakan di frontend.
}