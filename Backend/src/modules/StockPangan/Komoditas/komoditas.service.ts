import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KomoditasStockPangan } from './komoditas.entity';
import { CreateKomoditasDto } from './dto/create-komoditas.dto';
import { UpdateKomoditasDto } from './dto/update-komoditas.dto';

@Injectable()
export class KomoditasStockPanganService {
    constructor(
        @InjectRepository(KomoditasStockPangan)
        private komoditasRepo: Repository<KomoditasStockPangan>,
    ) { }

    async create(dto: CreateKomoditasDto) {
        const komoditas = this.komoditasRepo.create({
            komoditas: dto.komoditas,
            satuan: dto.satuan,
            keterangan: dto.keterangan,
            gambar: dto.gambar,
        });

        return this.komoditasRepo.save(komoditas);
    }

    findAll() {
        return this.komoditasRepo.find();
    }

    async findOne(id: number) {
        const komoditas = await this.komoditasRepo.findOne({ 
            where: { id }
        });
        if (!komoditas) {
            throw new NotFoundException(`Komoditas dengan ID ${id} tidak ditemukan`);
        }
        return komoditas;
    }

    async update(id: number, dto: UpdateKomoditasDto) {
        const komoditas = await this.findOne(id);

        Object.assign(komoditas, {
            komoditas: dto.komoditas ?? komoditas.komoditas,
            satuan: dto.satuan ?? komoditas.satuan,
            keterangan: dto.keterangan ?? komoditas.keterangan,
            gambar: dto.gambar ?? komoditas.gambar,
        });

        return this.komoditasRepo.save(komoditas);
    }

    async remove(id: number) {
        const komoditas = await this.findOne(id);
        await this.komoditasRepo.remove(komoditas);
        return { message: `Komoditas dengan ID ${id} berhasil dihapus` };
    }
}