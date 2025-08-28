import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spbe } from './spbe.entity';
import { CreateSpbeDto } from './dto/create-spbe.dto';
import { UpdateSpbeDto } from './dto/update-spbe.dto';

@Injectable()
export class SpbeService {
  constructor(
    @InjectRepository(Spbe)
    private readonly spbeRepository: Repository<Spbe>,
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

  async create(dto: CreateSpbeDto): Promise<Spbe> {
    const spbe = this.spbeRepository.create(dto);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      spbe.latitude = lat;
      spbe.longitude = lng;
    }

    return this.spbeRepository.save(spbe);
  }

  async findAll(): Promise<Spbe[]> {
    return this.spbeRepository.find({ relations: ['kecamatan', 'kelurahan'] });
  }

  async findOne(id: number): Promise<Spbe> {
    const spbe = await this.spbeRepository.findOne({
      where: { id_spbe: id },
      relations: ['kecamatan', 'kelurahan'],
    });

    if (!spbe) {
      throw new NotFoundException(`SPBE dengan ID ${id} tidak ditemukan`);
    }

    return spbe;
  }

  async update(id: number, dto: UpdateSpbeDto): Promise<Spbe> {
    const spbe = await this.findOne(id);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      dto.latitude = lat;
      dto.longitude = lng;
    }

    Object.assign(spbe, dto);
    return this.spbeRepository.save(spbe);
  }

  async remove(id: number): Promise<void> {
    const spbe = await this.findOne(id);
    await this.spbeRepository.remove(spbe);
  }
}