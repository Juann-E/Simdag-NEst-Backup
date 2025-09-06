import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportAgenLpgService } from './report-agen-lpg.service';
import { ReportAgenLpgDto, ReportAgenLpgYearlyDto } from './dto/report-agen-lpg.dto';
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
    @Res() res: Response,
  ) {
    try {
      const dto: ReportAgenLpgYearlyDto = {
        tahun: parseInt(year),
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
}