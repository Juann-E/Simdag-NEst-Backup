import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kelurahan } from './kelurahan.entity';
import { CreateKelurahanDto } from './dto/create-kelurahan.dto';
import { UpdateKelurahanDto } from './dto/update-kelurahan.dto';
import { Kecamatan } from '../Kecamatan/kecamatan.entity';

@Injectable()
export class KelurahanService {
  constructor(
    @InjectRepository(Kelurahan)
    private readonly kelurahanRepo: Repository<Kelurahan>,

    @InjectRepository(Kecamatan)
    private readonly kecamatanRepo: Repository<Kecamatan>,
  ) {}

  async create(dto: CreateKelurahanDto): Promise<Kelurahan> {
    const kecamatan = await this.kecamatanRepo.findOne({ where: { id_kecamatan: dto.id_kecamatan } });
    if (!kecamatan) throw new NotFoundException(`Kecamatan dengan ID ${dto.id_kecamatan} tidak ditemukan`);

    const kelurahan = this.kelurahanRepo.create({
      nama_kelurahan: dto.nama_kelurahan,
      keterangan: dto.keterangan,
      kecamatan,
    });

    return this.kelurahanRepo.save(kelurahan);
  }

  findAll(): Promise<Kelurahan[]> {
    return this.kelurahanRepo.find({ relations: ['kecamatan'] });
  }

  async findOne(id: number): Promise<Kelurahan> {
    const kelurahan = await this.kelurahanRepo.findOne({ 
      where: { id_kelurahan: id },
      relations: ['kecamatan']
    });
    if (!kelurahan) throw new NotFoundException(`Kelurahan ${id} tidak ditemukan`);
    return kelurahan;
  }

  async findByKecamatan(id_kecamatan: number): Promise<Kelurahan[]> {
    const kecamatan = await this.kecamatanRepo.findOne({ where: { id_kecamatan } });
    if (!kecamatan) throw new NotFoundException(`Kecamatan ${id_kecamatan} tidak ditemukan`);

    return this.kelurahanRepo.find({
      where: { kecamatan: { id_kecamatan } },
      relations: ['kecamatan']
    });
  }

  async update(id: number, dto: UpdateKelurahanDto): Promise<Kelurahan> {
    const kelurahan = await this.findOne(id);

    if (dto.id_kecamatan) {
      const kecamatan = await this.kecamatanRepo.findOne({ where: { id_kecamatan: dto.id_kecamatan } });
      if (!kecamatan) throw new NotFoundException(`Kecamatan dengan ID ${dto.id_kecamatan} tidak ditemukan`);
      kelurahan.kecamatan = kecamatan;
    }

    if (dto.nama_kelurahan !== undefined) kelurahan.nama_kelurahan = dto.nama_kelurahan;
    if (dto.keterangan !== undefined) kelurahan.keterangan = dto.keterangan;

    return this.kelurahanRepo.save(kelurahan);
  }

  async remove(id: number): Promise<void> {
    const kelurahan = await this.findOne(id);
    await this.kelurahanRepo.remove(kelurahan);
  }
}
