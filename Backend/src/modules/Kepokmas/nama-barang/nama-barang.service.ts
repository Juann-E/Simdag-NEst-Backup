import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NamaBarang } from './nama-barang.entity';
import { CreateNamaBarangDto } from './dto/create-nama-barang.dto';
import { UpdateNamaBarangDto } from './dto/update-nama-barang.dto';
import { SatuanBarang } from '../satuan-barang/satuan-barang.entity';

@Injectable()
export class NamaBarangService {
    constructor(
        @InjectRepository(NamaBarang)
        private namaBarangRepo: Repository<NamaBarang>,

        @InjectRepository(SatuanBarang)
        private satuanRepo: Repository<SatuanBarang>,
    ) { }

    async create(dto: CreateNamaBarangDto) {
        const satuan = await this.satuanRepo.findOne({ where: { idSatuan: dto.idSatuan } });
        if (!satuan) throw new NotFoundException('Satuan Barang tidak ditemukan');

        const barang = this.namaBarangRepo.create({
            namaBarang: dto.namaBarang,
            keterangan: dto.keterangan,
            gambar: dto.gambar,
            satuan,
        });

        return this.namaBarangRepo.save(barang);
    }
    findAll() {
        return this.namaBarangRepo.find();
    }

    async findOne(id: number) {
        const barang = await this.namaBarangRepo.findOne({ where: { id } });
        if (!barang) throw new NotFoundException('Barang tidak ditemukan');
        return barang;
    }

    async update(id: number, dto: UpdateNamaBarangDto) {
        const barang = await this.findOne(id);

        if (dto.idSatuan) {
            const satuan = await this.satuanRepo.findOne({ where: { idSatuan: dto.idSatuan } });
            if (!satuan) throw new NotFoundException('Satuan Barang tidak ditemukan');
            barang.satuan = satuan;
        }

        if (dto.namaBarang !== undefined) barang.namaBarang = dto.namaBarang;
        if (dto.keterangan !== undefined) barang.keterangan = dto.keterangan;
        if (dto.gambar !== undefined) barang.gambar = dto.gambar; // <-- update gambar

        return this.namaBarangRepo.save(barang);
    }

    async remove(id: number) {
        const barang = await this.findOne(id);
        return this.namaBarangRepo.remove(barang);
    }
}
