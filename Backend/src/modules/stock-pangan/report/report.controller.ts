import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ReportStockPanganService } from './report.service';
import type { ReportRequestDto, MonthlyReportDto } from './dto/report.dto';

@Controller('stock-pangan/report')
export class ReportStockPanganController {
  constructor(private readonly reportService: ReportStockPanganService) {}

  @Post('generate')
  async generateReport(@Body() dto: ReportRequestDto, @Res() res: Response) {
    try {
      const { fileType, ...reportDto } = dto;

      if (fileType === 'excel') {
        const { buffer, fileName } = await this.reportService.generateExcel(reportDto);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', buffer.length);
        
        return res.end(buffer);
      } else {
        const jsonData = await this.reportService.generateJson(reportDto);
        return res.status(HttpStatus.OK).json({
          success: true,
          data: jsonData,
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Gagal membuat laporan',
        error: error.message,
      });
    }
  }

  @Post('preview')
  async previewReport(@Body() dto: ReportRequestDto) {
    try {
      const { fileType, ...reportDto } = dto;
      const jsonData = await this.reportService.generateJson(reportDto);
      
      return {
        success: true,
        data: jsonData,
        total: jsonData.length,
      };
    } catch (error) {
      console.error('Error previewing report:', error);
      return {
        success: false,
        message: 'Gagal membuat preview laporan',
        error: error.message,
      };
    }
  }

  @Post('monthly-excel')
  async generateMonthlyExcel(@Body() dto: MonthlyReportDto, @Res() res: Response) {
    try {
      const { buffer, fileName } = await this.reportService.generateMonthlyExcel(dto);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', buffer.length);
      
      return res.end(buffer);
    } catch (error) {
      console.error('Error generating monthly excel:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Gagal membuat laporan bulanan Excel',
        error: error.message,
      });
    }
  }
}