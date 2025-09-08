export class ResponseRealisasiBulananBbmDto {
  id_realisasi_bbm: number;
  bulan: number;
  tahun: number;
  realisasi_liter: number;
  spbu: {
    id_spbu: number;
    nama_usaha: string;
    no_spbu: string;
    alamat: string;
    telepon: string;
    penanggung_jawab: string;
  };
  jenisBbm: {
    id_jenis_bbm: number;
    jenis_bbm: string;
    keterangan: string;
  };
}