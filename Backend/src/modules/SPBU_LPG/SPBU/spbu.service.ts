import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spbu } from './spbu.entity';
import { CreateSpbuDto } from './dto/create-spbu.dto';
import { UpdateSpbuDto } from './dto/update-spbu.dto';

@Injectable()
export class SpbuService {
  constructor(
    @InjectRepository(Spbu)
    private readonly spbuRepository: Repository<Spbu>,
  ) {}

  private parseCoordinate(input: string): { lat: number; lng: number } {
    const clean = input.replace(/\s+/g, '');

    // Format decimal: "-7.32,110.50"
    if (clean.includes(',')) {
      const parts = clean.split(',');
      if (!parts[0].includes('°') && !parts[1].includes('°')) {
        return { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
      }
    }

    // Helper konversi DMS → Decimal
    const dmsToDecimal = (dms: string): number => {
      const regex = /(\d+)°(\d+)'([\d.]+)"?([NSEW])/;
      const match = dms.match(regex);
      if (!match) throw new Error(`Format koordinat tidak valid: ${dms}`);

      const [, deg, min, sec, dir] = match;
      let decimal = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
      if (dir === 'S' || dir === 'W') decimal *= -1;
      return decimal;
    };

    // DMS pakai koma
    if (clean.includes(',')) {
      const [latStr, lngStr] = clean.split(',');
      return { lat: dmsToDecimal(latStr), lng: dmsToDecimal(lngStr) };
    }

    // DMS pakai spasi → contoh: "7°19'12.4\"S 110°30'45.5\"E"
    const parts = clean.split(/(?=[NSWE])/);
    if (parts.length === 2) {
      return { lat: dmsToDecimal(parts[0]), lng: dmsToDecimal(parts[1]) };
    }

    throw new Error(`Format koordinat tidak dikenali: ${input}`);
  }

  async create(dto: CreateSpbuDto): Promise<Spbu> {
    const spbu = this.spbuRepository.create(dto);

    // parsing koordinat
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      spbu.latitude = lat;
      spbu.longitude = lng;
    }

    return this.spbuRepository.save(spbu);
  }

  async findAll(): Promise<Spbu[]> {
    return this.spbuRepository.find({ relations: ['kecamatan', 'kelurahan'] });
  }

  async findOne(id: number): Promise<Spbu> {
    const spbu = await this.spbuRepository.findOne({
      where: { id_spbu: id },
      relations: ['kecamatan', 'kelurahan'],
    });
    if (!spbu) {
      throw new NotFoundException(`SPBU dengan id ${id} tidak ditemukan`);
    }
    return spbu;
  }

  async update(id: number, dto: UpdateSpbuDto): Promise<Spbu> {
    const spbu = await this.findOne(id);
    Object.assign(spbu, dto);

    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      spbu.latitude = lat;
      spbu.longitude = lng;
    }

    return this.spbuRepository.save(spbu);
  }

  async remove(id: number): Promise<void> {
    const spbu = await this.findOne(id);
    await this.spbuRepository.remove(spbu);
  }
}
