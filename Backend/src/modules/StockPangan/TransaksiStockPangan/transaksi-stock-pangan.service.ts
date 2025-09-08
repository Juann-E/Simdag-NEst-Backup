import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransaksiStockPangan } from './transaksi-stock-pangan.entity';
import { CreateTransaksiStockPanganDto } from './dto/create-transaksi-stock-pangan.dto';
import { UpdateTransaksiStockPanganDto } from './dto/update-transaksi-stock-pangan.dto';

@Injectable()
export class TransaksiStockPanganService {
  constructor(
    @InjectRepository(TransaksiStockPangan)
    private readonly transaksiStockPanganRepository: Repository<TransaksiStockPangan>,
  ) {}

  async create(createTransaksiStockPanganDto: CreateTransaksiStockPanganDto): Promise<TransaksiStockPangan> {
    const transaksi = this.transaksiStockPanganRepository.create(createTransaksiStockPanganDto);
    return await this.transaksiStockPanganRepository.save(transaksi);
  }

  async findAll(): Promise<TransaksiStockPangan[]> {
    return await this.transaksiStockPanganRepository.find({
      relations: ['distributor', 'komoditas'],
      order: {
        tahun: 'DESC',
        bulan: 'DESC',
        timeStamp: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<TransaksiStockPangan> {
    const transaksi = await this.transaksiStockPanganRepository.findOne({
      where: { idTransaksi: id },
      relations: ['distributor', 'komoditas']
    });

    if (!transaksi) {
      throw new NotFoundException(`Transaksi Stock Pangan dengan ID ${id} tidak ditemukan`);
    }

    return transaksi;
  }

  async update(id: number, updateTransaksiStockPanganDto: UpdateTransaksiStockPanganDto): Promise<TransaksiStockPangan> {
    const transaksi = await this.findOne(id);
    
    Object.assign(transaksi, updateTransaksiStockPanganDto);
    return await this.transaksiStockPanganRepository.save(transaksi);
  }

  async remove(id: number): Promise<void> {
    const transaksi = await this.findOne(id);
    await this.transaksiStockPanganRepository.remove(transaksi);
  }

  async findByTahunBulan(tahun: number, bulan: number): Promise<TransaksiStockPangan[]> {
    return await this.transaksiStockPanganRepository.find({
      where: { tahun, bulan },
      relations: ['distributor', 'komoditas'],
      order: {
        timeStamp: 'DESC'
      }
    });
  }

  async findByDistributor(idDistributor: number): Promise<TransaksiStockPangan[]> {
    return await this.transaksiStockPanganRepository.find({
      where: { idDistributor },
      relations: ['distributor', 'komoditas'],
      order: {
        tahun: 'DESC',
        bulan: 'DESC',
        timeStamp: 'DESC'
      }
    });
  }

  async findByKomoditas(idKomoditas: number): Promise<TransaksiStockPangan[]> {
    return await this.transaksiStockPanganRepository.find({
      where: { idKomoditas },
      relations: ['distributor', 'komoditas'],
      order: {
        tahun: 'DESC',
        bulan: 'DESC',
        timeStamp: 'DESC'
      }
    });
  }
}