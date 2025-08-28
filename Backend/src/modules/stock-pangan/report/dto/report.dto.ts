export interface ReportStockPanganDto {
  komoditasIds: number[];
  tahun?: number;
  bulan?: number;
  start?: string;
  end?: string;
}

export interface ReportRequestDto {
  komoditasIds: number[];
  tahun?: number;
  bulan?: number;
  start?: string;
  end?: string;
  fileType: 'excel' | 'json';
}

export interface MonthlyReportDto {
  tahun: number;
  bulan: number;
}