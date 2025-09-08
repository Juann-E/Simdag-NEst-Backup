import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealisasiBulananLpg, RealisasiBulananLpgMain } from './realisasi-bulanan-lpg.entity';
import { CreateRealisasiBulananLpgDto } from './dto/create-realisasi-bulanan-lpg.dto';
import { UpdateRealisasiBulananLpgDto } from './dto/update-realisasi-bulanan-lpg.dto';
import { ResponseRealisasiBulananLpgDto } from './dto/response-realisasi-bulanan-lpg.dto';

@Injectable()
export class RealisasiBulananLpgService {
  constructor(
    @InjectRepository(RealisasiBulananLpg)
    private readonly realisasiBulananLpgRepository: Repository<RealisasiBulananLpg>,
    @InjectRepository(RealisasiBulananLpgMain)
    private readonly realisasiBulananLpgMainRepository: Repository<RealisasiBulananLpgMain>,
  ) {}

  async create(createDto: CreateRealisasiBulananLpgDto): Promise<ResponseRealisasiBulananLpgDto> {
    // Buat record main terlebih dahulu
    const mainRealisasi = this.realisasiBulananLpgMainRepository.create({
      id_agen: createDto.id_agen,
      keterangan: `Realisasi LPG ${createDto.bulan}/${createDto.tahun}`
    });

    const savedMainRealisasi = await this.realisasiBulananLpgMainRepository.save(mainRealisasi);

    // Buat record detail
    const detailRealisasi = this.realisasiBulananLpgRepository.create({
      id_realisasi_lpg: savedMainRealisasi.id_realisasi_lpg,
      bulan: createDto.bulan,
      tahun: createDto.tahun,
      realisasi_tabung: createDto.realisasi_tabung
    });

    const savedDetailRealisasi = await this.realisasiBulananLpgRepository.save(detailRealisasi);
    return this.findOne(savedDetailRealisasi.id_detail);
  }

  async findAll(): Promise<ResponseRealisasiBulananLpgDto[]> {
    const realisasiList = await this.realisasiBulananLpgRepository.find({
      relations: ['realisasiMain', 'realisasiMain.agen'],
      order: {
        tahun: 'DESC',
        bulan: 'DESC',
        id_detail: 'DESC'
      }
    });

    return realisasiList.map(realisasi => this.mapToResponseDto(realisasi));
  }

  async findOne(id: number): Promise<ResponseRealisasiBulananLpgDto> {
    const realisasi = await this.realisasiBulananLpgRepository.findOne({
      where: { id_detail: id },
      relations: ['realisasiMain', 'realisasiMain.agen', 'realisasiMain.agen.kecamatan', 'realisasiMain.agen.kelurahan'],
    });

    if (!realisasi) {
      throw new NotFoundException(`Realisasi LPG dengan ID ${id} tidak ditemukan`);
    }

    return this.mapToResponseDto(realisasi);
  }

  async findByAgen(id_agen: number): Promise<ResponseRealisasiBulananLpgDto[]> {
    const realisasiList = await this.realisasiBulananLpgRepository.find({
      where: { realisasiMain: { id_agen } },
      relations: ['realisasiMain', 'realisasiMain.agen'],
      order: {
        tahun: 'DESC',
        bulan: 'DESC'
      }
    });

    return realisasiList.map(realisasi => this.mapToResponseDto(realisasi));
  }

  async findByPeriod(tahun: number, bulan?: number): Promise<ResponseRealisasiBulananLpgDto[]> {
    const queryBuilder = this.realisasiBulananLpgRepository
      .createQueryBuilder('realisasi')
      .leftJoinAndSelect('realisasi.realisasiMain', 'realisasiMain')
      .leftJoinAndSelect('realisasiMain.agen', 'agen')
      .where('realisasi.tahun = :tahun', { tahun });

    if (bulan) {
      queryBuilder.andWhere('realisasi.bulan = :bulan', { bulan });
    }

    const realisasiList = await queryBuilder
      .orderBy('realisasi.tahun', 'DESC')
      .addOrderBy('realisasi.bulan', 'DESC')
      .addOrderBy('realisasi.id_detail', 'DESC')
      .getMany();

    return realisasiList.map(realisasi => this.mapToResponseDto(realisasi));
  }

  async update(id: number, updateDto: UpdateRealisasiBulananLpgDto): Promise<ResponseRealisasiBulananLpgDto> {
    const realisasi = await this.realisasiBulananLpgRepository.findOne({
      where: { id_detail: id },
      relations: ['realisasiMain']
    });

    if (!realisasi) {
      throw new NotFoundException(`Realisasi LPG dengan ID ${id} tidak ditemukan`);
    }

    // Update data detail
    const detailUpdateData: any = {};
    if (updateDto.bulan !== undefined) detailUpdateData.bulan = updateDto.bulan;
    if (updateDto.tahun !== undefined) detailUpdateData.tahun = updateDto.tahun;
    if (updateDto.realisasi_tabung !== undefined) detailUpdateData.realisasi_tabung = updateDto.realisasi_tabung;

    if (Object.keys(detailUpdateData).length > 0) {
      await this.realisasiBulananLpgRepository.update(id, detailUpdateData);
    }

    // Update data main jika ada perubahan id_agen
    if (updateDto.id_agen !== undefined) {
      await this.realisasiBulananLpgMainRepository.update(realisasi.id_realisasi_lpg, {
        id_agen: updateDto.id_agen
      });
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const realisasi = await this.realisasiBulananLpgRepository.findOne({
      where: { id_detail: id },
      relations: ['realisasiMain']
    });

    if (!realisasi) {
      throw new NotFoundException(`Realisasi LPG dengan ID ${id} tidak ditemukan`);
    }

    const idRealisasiLpg = realisasi.id_realisasi_lpg;

    // Hapus detail terlebih dahulu
    await this.realisasiBulananLpgRepository.delete(id);

    // Cek apakah masih ada detail lain yang mereferensikan main
    const remainingDetails = await this.realisasiBulananLpgRepository.count({
      where: { id_realisasi_lpg: idRealisasiLpg }
    });

    // Jika tidak ada detail lain, hapus juga main
    if (remainingDetails === 0) {
      await this.realisasiBulananLpgMainRepository.delete(idRealisasiLpg);
    }

    return { message: `Realisasi LPG dengan ID ${id} berhasil dihapus` };
  }

  private mapToResponseDto(realisasi: RealisasiBulananLpg): ResponseRealisasiBulananLpgDto {
    const periode = `${realisasi.tahun}-${String(realisasi.bulan).padStart(2, '0')}`;
    return {
      id_realisasi_lpg: realisasi.id_detail,
      id_agen: realisasi.realisasiMain?.id_agen,
      bulan: realisasi.bulan,
      tahun: realisasi.tahun,
      periode: periode,
      realisasi_tabung: realisasi.realisasi_tabung,
      agen: realisasi.realisasiMain?.agen ? {
        id_agen: realisasi.realisasiMain.agen.id_agen,
        nama_usaha: realisasi.realisasiMain.agen.nama_usaha,
        alamat: realisasi.realisasiMain.agen.alamat,
        telepon: realisasi.realisasiMain.agen.telepon,
        penanggung_jawab: realisasi.realisasiMain.agen.penanggung_jawab,
        status: realisasi.realisasiMain.agen.status,
      } : undefined,
    };
  }
}