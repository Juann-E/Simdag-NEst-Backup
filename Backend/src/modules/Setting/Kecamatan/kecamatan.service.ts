import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kecamatan } from './kecamatan.entity';
import { CreateKecamatanDto } from './dto/create-kecamatan.dto';
import { UpdateKecamatanDto } from './dto/update-kecamatan.dto';

@Injectable()
export class KecamatanService {
  constructor(
    @InjectRepository(Kecamatan)
    private readonly kecamatanRepo: Repository<Kecamatan>,
  ) {}

  async create(dto: CreateKecamatanDto) {
    const kecamatan = this.kecamatanRepo.create({
      nama_kecamatan: dto.nama_kecamatan,
      keterangan: dto.keterangan,
    });
    return this.kecamatanRepo.save(kecamatan);
  }

  findAll() {
    return this.kecamatanRepo.find({ relations: ['kelurahan'] });
  }

  async findOne(id: number) {
    const kecamatan = await this.kecamatanRepo.findOne({
      where: { id_kecamatan: id },
      relations: ['kelurahan'],
    });
    if (!kecamatan) throw new NotFoundException(`Kecamatan dengan ID ${id} tidak ditemukan`);
    return kecamatan;
  }

  async update(id: number, dto: UpdateKecamatanDto) {
    const kecamatan = await this.findOne(id);

    if (dto.nama_kecamatan !== undefined) kecamatan.nama_kecamatan = dto.nama_kecamatan;
    if (dto.keterangan !== undefined) kecamatan.keterangan = dto.keterangan;

    return this.kecamatanRepo.save(kecamatan);
  }

  async remove(id: number) {
    const kecamatan = await this.findOne(id);
    return this.kecamatanRepo.remove(kecamatan);
  }
}
