import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRealisasiBulananBbmDto } from './dto/create-realisasi-bulanan-bbm.dto';
import { UpdateRealisasiBulananBbmDto } from './dto/update-realisasi-bulanan-bbm.dto';
import { RealisasiBulananBbm } from './realisasi-bulanan-bbm.entity';

@Injectable()
export class RealisasiBulananBbmService {
  constructor(
    @InjectRepository(RealisasiBulananBbm)
    private realisasiBulananBbmRepository: Repository<RealisasiBulananBbm>,
  ) {}

  async create(createRealisasiBulananBbmDto: CreateRealisasiBulananBbmDto): Promise<RealisasiBulananBbm> {
    try {
      // Check if realisasi already exists for this combination
      const existingRealisasi = await this.realisasiBulananBbmRepository.findOne({
        where: {
          id_spbu: createRealisasiBulananBbmDto.id_spbu,
          bulan: createRealisasiBulananBbmDto.bulan,
          tahun: createRealisasiBulananBbmDto.tahun,
          id_jenis_bbm: createRealisasiBulananBbmDto.id_jenis_bbm,
        },
      });

      if (existingRealisasi) {
        throw new BadRequestException(
          `Realisasi BBM untuk SPBU ${createRealisasiBulananBbmDto.id_spbu}, bulan ${createRealisasiBulananBbmDto.bulan} ${createRealisasiBulananBbmDto.tahun}, jenis BBM ${createRealisasiBulananBbmDto.id_jenis_bbm} sudah ada`
        );
      }

      // Create realisasi record
      const realisasi = this.realisasiBulananBbmRepository.create({
        id_spbu: createRealisasiBulananBbmDto.id_spbu,
        bulan: createRealisasiBulananBbmDto.bulan,
        tahun: createRealisasiBulananBbmDto.tahun,
        id_jenis_bbm: createRealisasiBulananBbmDto.id_jenis_bbm,
        realisasi_liter: createRealisasiBulananBbmDto.realisasi_liter,
      });

      const savedRealisasi = await this.realisasiBulananBbmRepository.save(realisasi);
      return savedRealisasi;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Gagal membuat realisasi BBM: ' + error.message);
    }
  }

  async findAll(): Promise<RealisasiBulananBbm[]> {
    const realisasiData = await this.realisasiBulananBbmRepository.find({
      order: { tahun: 'DESC', bulan: 'DESC' },
    });

    return realisasiData;
  }

  async findBySpbu(id_spbu: number): Promise<RealisasiBulananBbm[]> {
    const realisasiData = await this.realisasiBulananBbmRepository.find({
      where: { id_spbu },
      order: { tahun: 'DESC', bulan: 'DESC' },
    });

    return realisasiData;
  }

  async findOne(id: number): Promise<RealisasiBulananBbm> {
    const realisasiData = await this.realisasiBulananBbmRepository.findOne({
      where: { id_realisasi_bbm: id },
    });

    if (!realisasiData) {
      throw new NotFoundException(`Realisasi BBM dengan ID ${id} tidak ditemukan`);
    }

    return realisasiData;
  }

  async update(id: number, updateRealisasiBulananBbmDto: UpdateRealisasiBulananBbmDto): Promise<RealisasiBulananBbm> {
    const realisasiData = await this.realisasiBulananBbmRepository.findOne({
      where: { id_realisasi_bbm: id },
    });

    if (!realisasiData) {
      throw new NotFoundException(`Realisasi BBM dengan ID ${id} tidak ditemukan`);
    }

    // Update record
    const updateData: any = {};
    if (updateRealisasiBulananBbmDto.id_spbu) updateData.id_spbu = updateRealisasiBulananBbmDto.id_spbu;
    if (updateRealisasiBulananBbmDto.bulan) updateData.bulan = updateRealisasiBulananBbmDto.bulan;
    if (updateRealisasiBulananBbmDto.tahun) updateData.tahun = updateRealisasiBulananBbmDto.tahun;
    if (updateRealisasiBulananBbmDto.id_jenis_bbm) updateData.id_jenis_bbm = updateRealisasiBulananBbmDto.id_jenis_bbm;
    if (updateRealisasiBulananBbmDto.realisasi_liter !== undefined) updateData.realisasi_liter = updateRealisasiBulananBbmDto.realisasi_liter;

    if (Object.keys(updateData).length > 0) {
      await this.realisasiBulananBbmRepository.update(id, updateData);
    }
    
    const updatedRealisasiData = await this.realisasiBulananBbmRepository.findOne({
      where: { id_realisasi_bbm: id },
    });

    if (!updatedRealisasiData) {
      throw new NotFoundException(`Realisasi BBM dengan ID ${id} tidak ditemukan setelah update`);
    }

    return updatedRealisasiData;
  }

  async remove(id: number): Promise<void> {
    const realisasiData = await this.realisasiBulananBbmRepository.findOne({
      where: { id_realisasi_bbm: id },
    });

    if (!realisasiData) {
      throw new NotFoundException(`Realisasi BBM dengan ID ${id} tidak ditemukan`);
    }

    await this.realisasiBulananBbmRepository.remove(realisasiData);
  }
}