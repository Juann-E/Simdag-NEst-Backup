export class ReportAgenLpgDto {
  bulan: number;
  tahun: number;
}

export class ReportAgenLpgYearlyDto {
  tahun: number;
  kuota_mt: number;
}

export enum ReportType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}