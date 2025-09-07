import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportAgenLpgService } from './report-agen-lpg.service';
import { ReportAgenLpgDto, ReportAgenLpgYearlyDto, ReportAgenLpgStatisticsDto, ReportAgenLpgYearlyStatisticsDto } from './dto/report-agen-lpg.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('public/report-agen-lpg')
export class ReportAgenLpgController {
  constructor(private readonly reportAgenLpgService: ReportAgenLpgService) {}

  @Public()
  @Get('download-monthly')
  async downloadMonthlyReport(
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgDto = {
        bulan: parseInt(month),
        tahun: parseInt(year),
      };

      const { buffer, fileName } = await this.reportAgenLpgService.generateMonthlyReport(dto);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating monthly report:', error);
      res.status(500).json({ message: 'Error generating report', error: error.message });
    }
  }

  @Public()
  @Get('download-yearly')
  async downloadYearlyReport(
    @Query('year') year: string,
    @Query('kuota_mt') kuota_mt: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgYearlyDto = {
        tahun: parseInt(year),
        kuota_mt: parseFloat(kuota_mt),
      };

      const { buffer, fileName } = await this.reportAgenLpgService.generateYearlyReport(dto);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating yearly report:', error);
      res.status(500).json({ message: 'Error generating report', error: error.message });
    }
  }

  @Public()
  @Get('download-monthly-statistics-pdf')
  async downloadMonthlyStatisticsPDF(
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgStatisticsDto = {
        bulan: parseInt(month),
        tahun: parseInt(year),
        format: 'pdf',
        includeCharts: true,
        includeAnalytics: true
      };

      const { buffer, fileName } = await this.reportAgenLpgService.generatePDFReport(dto);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating monthly statistics PDF:', error);
      res.status(500).json({ message: 'Error generating statistics PDF', error: error.message });
    }
  }

  @Public()
  @Get('download-monthly-statistics-word')
  async downloadMonthlyStatisticsWord(
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgStatisticsDto = {
        bulan: parseInt(month),
        tahun: parseInt(year),
        format: 'word',
        includeCharts: true,
        includeAnalytics: true
      };

      const { buffer, fileName } = await this.reportAgenLpgService.generateWordReport(dto);

      res.setHeader('Content-Type', 'application/rtf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating monthly statistics Word:', error);
      res.status(500).json({ message: 'Error generating statistics Word', error: error.message });
    }
  }

  @Public()
  @Get('download-yearly-statistics-pdf')
  async downloadYearlyStatisticsPDF(
    @Query('year') year: string,
    @Query('kuota_mt') kuota_mt: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgYearlyStatisticsDto = {
        tahun: parseInt(year),
        kuota_mt: parseFloat(kuota_mt),
        format: 'pdf',
        includeCharts: true,
        includeAnalytics: true
      };

      const { buffer, fileName } = await this.reportAgenLpgService.generatePDFReport(dto);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating yearly statistics PDF:', error);
      res.status(500).json({ message: 'Error generating statistics PDF', error: error.message });
    }
  }

  @Public()
  @Get('download-yearly-statistics-word')
  async downloadYearlyStatisticsWord(
    @Query('year') year: string,
    @Query('kuota_mt') kuota_mt: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgYearlyStatisticsDto = {
        tahun: parseInt(year),
        kuota_mt: parseFloat(kuota_mt),
        format: 'word',
        includeCharts: true,
        includeAnalytics: true
      };

      const { buffer, fileName } = await this.reportAgenLpgService.generateWordReport(dto);

      res.setHeader('Content-Type', 'application/rtf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating yearly statistics Word:', error);
      res.status(500).json({ message: 'Error generating statistics Word', error: error.message });
    }
  }

  @Public()
  @Get('statistics')
  async getStatistics(
    @Res() res: Response,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('kuota_mt') kuota_mt?: string,
  ) {
    try {
      let dto: ReportAgenLpgStatisticsDto | ReportAgenLpgYearlyStatisticsDto;
      
      if (month && year) {
        dto = {
          bulan: parseInt(month),
          tahun: parseInt(year),
          format: 'pdf' // Default format
        };
      } else if (year) {
        dto = {
          tahun: parseInt(year),
          kuota_mt: kuota_mt ? parseFloat(kuota_mt) : 0,
          format: 'pdf' // Default format
        };
      } else {
        return res.status(400).json({ message: 'Year parameter is required' });
      }

      const statistics = await this.reportAgenLpgService.generateStatistics(dto);
      return { success: true, data: statistics };
    } catch (error) {
      console.error('Error generating statistics:', error);
      return { success: false, message: 'Error generating statistics', error: error.message };
    }
  }
}