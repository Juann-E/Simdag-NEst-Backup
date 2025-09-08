import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agen } from './agen.entity';
import { CreateAgenDto } from './dto/create-agen.dto';
import { UpdateAgenDto } from './dto/update-agen.dto';

@Injectable()
export class AgenService {
  constructor(
    @InjectRepository(Agen)
    private readonly agenRepository: Repository<Agen>,
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

  async create(dto: CreateAgenDto): Promise<Agen> {
    const agen = this.agenRepository.create(dto);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      agen.latitude = lat;
      agen.longitude = lng;
    }

    return this.agenRepository.save(agen);
  }

  async findAll(): Promise<Agen[]> {
    return this.agenRepository.find({ relations: ['kecamatan', 'kelurahan'] });
  }

  async findOne(id: number): Promise<Agen> {
    const agen = await this.agenRepository.findOne({
      where: { id_agen: id },
      relations: ['kecamatan', 'kelurahan'],
    });

    if (!agen) {
      throw new NotFoundException(`Agen dengan ID ${id} tidak ditemukan`);
    }

    return agen;
  }

  async update(id: number, dto: UpdateAgenDto): Promise<Agen> {
    const agen = await this.findOne(id);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      dto.latitude = lat;
      dto.longitude = lng;
    }

    Object.assign(agen, dto);
    return this.agenRepository.save(agen);
  }

  async remove(id: number): Promise<void> {
    const agen = await this.findOne(id);
    await this.agenRepository.remove(agen);
  }
}