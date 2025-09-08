import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JenisBbm } from './jenis-bbm.entity';
import { CreateJenisBbmDto } from './dto/create-jenis-bbm.dto';
import { UpdateJenisBbmDto } from './dto/update-jenis-bbm.dto';

@Injectable()
export class JenisBbmService {
  constructor(
    @InjectRepository(JenisBbm)
    private jenisBbmRepository: Repository<JenisBbm>,
  ) {}

  async create(createJenisBbmDto: CreateJenisBbmDto): Promise<JenisBbm> {
    const jenisBbm = this.jenisBbmRepository.create(createJenisBbmDto);
    return this.jenisBbmRepository.save(jenisBbm);
  }

  async findAll(): Promise<JenisBbm[]> {
    return this.jenisBbmRepository.find();
  }

  async findOne(id: number): Promise<JenisBbm> {
    const jenisBbm = await this.jenisBbmRepository.findOne({
      where: { id_jenis_bbm: id },
    });

    if (!jenisBbm) {
      throw new NotFoundException(`Jenis BBM dengan ID ${id} tidak ditemukan`);
    }

    return jenisBbm;
  }

  async update(id: number, updateJenisBbmDto: UpdateJenisBbmDto): Promise<JenisBbm> {
    const jenisBbm = await this.findOne(id);
    Object.assign(jenisBbm, updateJenisBbmDto);
    return this.jenisBbmRepository.save(jenisBbm);
  }

  async remove(id: number): Promise<void> {
    const jenisBbm = await this.findOne(id);
    await this.jenisBbmRepository.remove(jenisBbm);
  }
}