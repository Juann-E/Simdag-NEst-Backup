import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportBbmService } from './report-bbm.service';
import { ReportBbmDto, ReportBbmYearlyDto } from './dto/report-bbm.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('public/report-bbm')
export class ReportBbmController {
  constructor(private readonly reportBbmService: ReportBbmService) {}

  @Public()
  @Get('download-monthly')
  async downloadMonthlyReport(
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportBbmDto = {
        bulan: parseInt(month),
        tahun: parseInt(year),
      };

      const { buffer, fileName } = await this.reportBbmService.generateMonthlyReport(dto);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating monthly BBM report:', error);
      res.status(500).json({ message: 'Error generating BBM report', error: error.message });
    }
  }

  @Public()
  @Get('download-yearly')
  async downloadYearlyReport(
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    try {
      const dto: ReportBbmYearlyDto = {
        tahun: parseInt(year),
      };

      const { buffer, fileName } = await this.reportBbmService.generateYearlyReport(dto);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating yearly BBM report:', error);
      res.status(500).json({ message: 'Error generating yearly BBM report', error: error.message });
    }
  }
}