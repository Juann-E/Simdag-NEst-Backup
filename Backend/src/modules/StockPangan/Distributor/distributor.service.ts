import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Distributor } from './distributor.entity';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';

@Injectable()
export class DistributorService {
  constructor(
    @InjectRepository(Distributor)
    private distributorRepo: Repository<Distributor>,
  ) {}

  async create(createDistributorDto: CreateDistributorDto): Promise<Distributor> {
    const distributor = this.distributorRepo.create(createDistributorDto);
    return this.distributorRepo.save(distributor);
  }

  async findAll(): Promise<Distributor[]> {
    return this.distributorRepo.find({
      relations: ['kecamatan', 'kelurahan'],
      order: { time_stamp: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Distributor> {
    const distributor = await this.distributorRepo.findOne({
      where: { id },
      relations: ['kecamatan', 'kelurahan']
    });
    if (!distributor) {
      throw new NotFoundException(`Distributor dengan ID ${id} tidak ditemukan`);
    }
    return distributor;
  }

  async update(id: number, updateDistributorDto: UpdateDistributorDto): Promise<Distributor> {
    const distributor = await this.findOne(id);
    Object.assign(distributor, updateDistributorDto);
    return this.distributorRepo.save(distributor);
  }

  async remove(id: number): Promise<void> {
    const distributor = await this.findOne(id);
    await this.distributorRepo.remove(distributor);
  }
}