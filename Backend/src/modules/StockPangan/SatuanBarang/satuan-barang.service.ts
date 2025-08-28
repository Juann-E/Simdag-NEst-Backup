import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SatuanBarangStockPangan } from './satuan-barang.entity';
import { CreateSatuanBarangDto } from './dto/create-satuan-barang.dto';
import { UpdateSatuanBarangDto } from './dto/update-satuan-barang.dto';

@Injectable()
export class SatuanBarangStockPanganService {
  constructor(
    @InjectRepository(SatuanBarangStockPangan)
    private readonly satuanBarangRepo: Repository<SatuanBarangStockPangan>,
  ) {}

  create(dto: CreateSatuanBarangDto) {
    const satuan = this.satuanBarangRepo.create(dto);
    return this.satuanBarangRepo.save(satuan);
  }

  findAll() {
    return this.satuanBarangRepo.find();
  }

  async update(id: number, dto: UpdateSatuanBarangDto) {
    const satuan = await this.satuanBarangRepo.findOne({ where: { idSatuan: id } });
    if (!satuan) {
      throw new NotFoundException(`Satuan dengan ID ${id} tidak ditemukan`);
    }
    Object.assign(satuan, dto);
    return this.satuanBarangRepo.save(satuan);
  }

  async remove(id: number) {
    const result = await this.satuanBarangRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Satuan dengan ID ${id} tidak ditemukan`);
    }
    return { message: `Satuan dengan ID ${id} dihapus` };
  }
}