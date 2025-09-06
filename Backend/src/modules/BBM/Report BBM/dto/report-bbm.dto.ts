export class ReportBbmDto {
  bulan: number;
  tahun: number;
}

export class ReportBbmYearlyDto {
  tahun: number;
}

export enum ReportType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}