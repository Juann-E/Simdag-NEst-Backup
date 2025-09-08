import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NamaKomoditas } from './nama-komoditas.entity';
import { CreateNamaKomoditasDto } from './dto/create-nama-komoditas.dto';
import { UpdateNamaKomoditasDto } from './dto/update-nama-komoditas.dto';

@Injectable()
export class NamaKomoditasService {
  constructor(
    @InjectRepository(NamaKomoditas)
    private namaKomoditasRepository: Repository<NamaKomoditas>,
  ) {}

  async create(createNamaKomoditasDto: CreateNamaKomoditasDto): Promise<NamaKomoditas> {
    const namaKomoditas = this.namaKomoditasRepository.create(createNamaKomoditasDto);
    return await this.namaKomoditasRepository.save(namaKomoditas);
  }

  async findAll(): Promise<NamaKomoditas[]> {
    return await this.namaKomoditasRepository.find({
      relations: ['satuan'],
      order: { time_stamp: 'DESC' }
    });
  }

  async findOne(id: number): Promise<NamaKomoditas> {
    const namaKomoditas = await this.namaKomoditasRepository.findOne({
      where: { id_komoditas: id },
      relations: ['satuan']
    });
    
    if (!namaKomoditas) {
      throw new NotFoundException(`Komoditas dengan ID ${id} tidak ditemukan`);
    }
    
    return namaKomoditas;
  }

  async update(id: number, updateNamaKomoditasDto: UpdateNamaKomoditasDto): Promise<NamaKomoditas> {
    const namaKomoditas = await this.findOne(id);
    
    Object.assign(namaKomoditas, updateNamaKomoditasDto);
    
    return await this.namaKomoditasRepository.save(namaKomoditas);
  }

  async remove(id: number): Promise<void> {
    const namaKomoditas = await this.findOne(id);
    await this.namaKomoditasRepository.remove(namaKomoditas);
  }
}