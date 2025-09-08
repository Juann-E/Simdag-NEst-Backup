export class ResponseRealisasiBulananLpgDto {
  id_realisasi_lpg: number;
  id_agen: number;
  bulan: number;
  tahun: number;
  periode: string;
  realisasi_tabung: number;
  agen?: {
    id_agen: number;
    nama_usaha: string;
    alamat: string;
    telepon?: string;
    penanggung_jawab?: string;
    status: string;
    kecamatan?: {
      id_kecamatan: number;
      nama_kecamatan: string;
    };
    kelurahan?: {
      id_kelurahan: number;
      nama_kelurahan: string;
    };
  };
}