import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarangPasarGrid } from './barang-pasar-grid.entity';
import { CreateBarangPasarGridDto } from './dto/create-barang-pasar.dto';
import { UpdateBarangPasarGridDto } from './dto/update-barang-pasar.dto';
import { NamaPasar } from '../nama-pasar/nama-pasar.entity';
import { NamaBarang } from '../nama-barang/nama-barang.entity';

@Injectable()
export class BarangPasarGridService {
  constructor(
    @InjectRepository(BarangPasarGrid)
    private readonly gridRepo: Repository<BarangPasarGrid>,
    @InjectRepository(NamaPasar)
    private readonly pasarRepo: Repository<NamaPasar>,
    @InjectRepository(NamaBarang)
    private readonly barangRepo: Repository<NamaBarang>,
  ) { }

  // Membuat data baru
  async create(dto: CreateBarangPasarGridDto) {
    const pasar = await this.pasarRepo.findOne({ where: { id: dto.idPasar } });
    if (!pasar) throw new NotFoundException('Pasar tidak ditemukan');

    const barang = await this.barangRepo.findOne({ where: { id: dto.idBarang } });
    if (!barang) throw new NotFoundException('Barang tidak ditemukan');

    const grid = this.gridRepo.create({
      pasar,
      barang,
      keterangan: dto.keterangan,
    });

    return this.gridRepo.save(grid);
  }
  
  async filter(idPasar?: number, idBarang?: number) {
    const query = this.gridRepo
      .createQueryBuilder('grid')
      .leftJoinAndSelect('grid.pasar', 'pasar')
      .leftJoinAndSelect('grid.barang', 'barang')
      .leftJoinAndSelect('barang.satuan', 'satuan');

    if (idPasar !== undefined) query.andWhere('pasar.id = :idPasar', { idPasar });
    if (idBarang !== undefined) query.andWhere('barang.id = :idBarang', { idBarang });

    const result = await query.getMany();

    if (result.length === 0) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return result;
  }

  // Ambil semua data
  findAll() {
    return this.gridRepo.find({ relations: ['pasar', 'barang'] });
  }

  // Ambil data berdasarkan pasar
  async findByPasar(idPasar: number) {
    return this.gridRepo.find({
      where: { pasar: { id: idPasar } },
      relations: ['pasar', 'barang'],
    });
  }

  // Ambil satu data berdasarkan pasar dan barang
  async findByPasarAndBarang(idPasar: number, idBarang: number) {
    return this.gridRepo
      .createQueryBuilder('grid')
      .leftJoinAndSelect('grid.pasar', 'pasar')
      .leftJoinAndSelect('grid.barang', 'barang')
      .leftJoinAndSelect('barang.satuan', 'satuan')
      .where('pasar.id = :idPasar', { idPasar })
      .andWhere('barang.id = :idBarang', { idBarang })
      .getOne();
  }

  // Update data berdasarkan pasar dan barang
  async updateByPasarAndBarang(
    idPasar: number,
    idBarang: number,
    dto: UpdateBarangPasarGridDto,
  ) {
    const item = await this.gridRepo.findOne({
      where: { pasar: { id: idPasar }, barang: { id: idBarang } },
    });
    if (!item) throw new NotFoundException('Barang pasar tidak ditemukan');

    if (dto.keterangan !== undefined) item.keterangan = dto.keterangan;

    if (dto.idPasar !== undefined && dto.idPasar !== null) {
      const pasar = await this.pasarRepo.findOne({ where: { id: dto.idPasar } });
      if (!pasar) throw new NotFoundException('Pasar tidak ditemukan');
      item.pasar = pasar;
    }

    if (dto.idBarang !== undefined && dto.idBarang !== null) {
      const barang = await this.barangRepo.findOne({ where: { id: dto.idBarang } });
      if (!barang) throw new NotFoundException('Barang tidak ditemukan');
      item.barang = barang;
    }

    return this.gridRepo.save(item);
  }

  // Hapus data berdasarkan pasar dan barang
  async removeByPasarAndBarang(idPasar: number, idBarang: number) {
    const item = await this.gridRepo.findOne({
      where: { pasar: { id: idPasar }, barang: { id: idBarang } },
    });
    if (!item) throw new NotFoundException('Barang pasar tidak ditemukan');

    return this.gridRepo.remove(item);
  }
}
