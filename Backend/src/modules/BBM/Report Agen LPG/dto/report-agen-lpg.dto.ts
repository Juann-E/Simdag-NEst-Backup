export class ReportAgenLpgDto {
  bulan: number;
  tahun: number;
}

export class ReportAgenLpgYearlyDto {
  tahun: number;
  kuota_mt: number;
}

export class ReportAgenLpgStatisticsDto {
  bulan?: number;
  tahun: number;
  format: 'pdf' | 'word';
  includeCharts?: boolean;
  includeAnalytics?: boolean;
}

export class ReportAgenLpgYearlyStatisticsDto {
  tahun: number;
  kuota_mt: number;
  format: 'pdf' | 'word';
  includeCharts?: boolean;
  includeAnalytics?: boolean;
}

export interface StatisticsData {
  totalRealisasi: number;
  averageRealisasi: number;
  maxRealisasi: number;
  minRealisasi: number;
  totalAgen: number;
  agenAktif: number;
  persentaseRealisasi: number;
  trendAnalysis: {
    isIncreasing: boolean;
    percentageChange: number;
    comparison: string;
  };
  topPerformers: {
    nama_usaha: string;
    realisasi_tabung: number;
    alamat: string;
  }[];
  monthlyBreakdown?: {
    bulan: number;
    totalRealisasi: number;
    jumlahAgen: number;
  }[];
}

export enum ReportType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}