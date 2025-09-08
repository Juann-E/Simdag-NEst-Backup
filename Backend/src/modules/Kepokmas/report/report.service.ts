// report.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { NamaPasar } from '../nama-pasar/nama-pasar.entity';
import { BarangPasarGrid } from '../barang-pasar-grid/barang-pasar-grid.entity';
import { HargaBarangPasar } from '../harga-barang-grid/harga-barang-pasar.entity';
import { ExcelBuilder } from './utils/excel-builder';

// Definisikan tipe DTO agar konsisten
export interface ReportDto {
  pasarIds: number[];
  barangIds: number[];
  namaPasar?: string;
  start?: string;
  end?: string;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(NamaPasar) private readonly pasarRepo: Repository<NamaPasar>,
    @InjectRepository(BarangPasarGrid) private readonly barangRepo: Repository<BarangPasarGrid>,
    @InjectRepository(HargaBarangPasar) private readonly hargaRepo: Repository<HargaBarangPasar>,
  ) {}

  // Mengatur waktu ke awal hari (00:00:00) berdasarkan timezone server.
  private parseStartDate(date?: string): Date | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Mengatur waktu ke akhir hari (23:59:59) berdasarkan timezone server.
  private parseEndDate(date?: string): Date | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  async generateJson(dto: ReportDto) {
    const { pasarIds, barangIds, start, end } = dto;

    const where: any = {};

    // Blok kode yang Anda sebutkan sudah berada di sini dan ini adalah posisi yang benar.
    // Ini adalah kunci untuk memfilter data berdasarkan rentang tanggal yang dipilih.
    if (start && end) {
      where.tanggal_harga = Between(this.parseStartDate(start), this.parseEndDate(end));
    }
    
    if (pasarIds.length) where.barangPasar = { pasar: { id: In(pasarIds) } };
    if (barangIds.length) where.barangPasar = { ...(where.barangPasar || {}), barang: { id: In(barangIds) } };

    const hargaList = await this.hargaRepo.find({
      where,
      relations: ['barangPasar', 'barangPasar.barang', 'barangPasar.pasar'],
      order: { tanggal_harga: 'ASC' },
    });

    return hargaList.map((h) => ({
      pasar: h.barangPasar.pasar.nama_pasar,
      barang: h.barangPasar.barang.namaBarang,
      harga: h.harga,
      tanggal: h.tanggal_harga instanceof Date ? h.tanggal_harga.toISOString().split('T')[0] : h.tanggal_harga,
    }));
  }

  async generateExcel(dto: ReportDto): Promise<{ buffer: Buffer; fileName: string }> {
    const { start, end, namaPasar, pasarIds } = dto;
    const hargaList = await this.generateJson(dto);
    
    // ambil daftar tanggal unik
    const tanggalList = Array.from(new Set(hargaList.map((h) => h.tanggal))).sort();

    // pivot data: { namaBarang: { harga: {tanggal: harga} } }
    const pivot: Record<string, any> = {};
    for (const h of hargaList) {
      if (!pivot[h.barang]) pivot[h.barang] = { harga: {} };
      pivot[h.barang].harga[h.tanggal] = h.harga;
    }

    const pasarNameForTitle = namaPasar || (pasarIds.length ? `Pasar Terpilih (ID: ${pasarIds.join(',')})` : 'Semua Pasar');
    
    const pasarNameForFile = (namaPasar || 'laporan').replace(/ /g, '_');
    const today = new Date().toISOString().split('T')[0];
    const fileName = `${pasarNameForFile}_${today}.xlsx`;

    const buffer = await ExcelBuilder.buildExcel(pasarNameForTitle, start || 'Semua', end || 'Waktu', tanggalList, pivot);
    
    return { buffer, fileName };
  }
}