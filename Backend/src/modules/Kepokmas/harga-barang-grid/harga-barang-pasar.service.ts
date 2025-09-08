import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HargaBarangPasar } from './harga-barang-pasar.entity';
import { CreateHargaBarangPasarDto } from './dto/create-harga-barang-pasar.dto';
import { UpdateHargaBarangPasarDto } from './dto/update-harga-barang-pasar.dto';

@Injectable()
export class HargaBarangPasarService {
  constructor(
    @InjectRepository(HargaBarangPasar)
    private hargaRepo: Repository<HargaBarangPasar>,
  ) {}

  async create(dto: CreateHargaBarangPasarDto) {
    const harga = this.hargaRepo.create(dto);
    return await this.hargaRepo.save(harga);
  }

  async filter(params: { id_harga?: number; id_barang_pasar?: number }) {
    const query = this.hargaRepo.createQueryBuilder('harga')
      .leftJoinAndSelect('harga.barangPasar', 'barangPasar')
      .leftJoinAndSelect('barangPasar.pasar', 'pasar')
      .leftJoinAndSelect('barangPasar.barang', 'barang');

    if (params.id_harga) {
      query.andWhere('harga.id_harga = :id_harga', { id_harga: params.id_harga });
    }

    if (params.id_barang_pasar) {
      query.andWhere('harga.id_barang_pasar = :id_barang_pasar', { id_barang_pasar: params.id_barang_pasar });
    }

    return await query.getMany();
  }

  async findAll() {
    // ## PERUBAHAN UTAMA DI SINI ##
    // Menambahkan relasi yang lebih dalam agar data pasar dan barang ikut terkirim
    return await this.hargaRepo.find({
      relations: [
        'barangPasar',
        'barangPasar.pasar',
        'barangPasar.barang',
        'barangPasar.barang.satuan',
      ],
    });
  }

  async findOne(id: number) {
    // ## PERUBAHAN KONSISTENSI DI SINI ##
    // Menambahkan relasi yang sama seperti di findAll
    const data = await this.hargaRepo.findOne({
      where: { id_harga: id },
      relations: [
        'barangPasar',
        'barangPasar.pasar',
        'barangPasar.barang',
        'barangPasar.barang.satuan',
      ],
    });
    if (!data) throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    return data;
  }

  async update(id: number, dto: UpdateHargaBarangPasarDto) {
    const data = await this.findOne(id);
    Object.assign(data, dto);
    return await this.hargaRepo.save(data);
  }

  async remove(id: number) {
    const data = await this.findOne(id);
    return await this.hargaRepo.remove(data);
  }
}