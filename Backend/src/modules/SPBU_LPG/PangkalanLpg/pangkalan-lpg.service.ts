import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PangkalanLpg } from './pangkalan-lpg.entity';
import { CreatePangkalanLpgDto } from './dto/create-pangkalan-lpg.dto';
import { UpdatePangkalanLpgDto } from './dto/update-pangkalan-lpg.dto';

@Injectable()
export class PangkalanLpgService {
  constructor(
    @InjectRepository(PangkalanLpg)
    private readonly pangkalanLpgRepository: Repository<PangkalanLpg>,
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

  async create(dto: CreatePangkalanLpgDto): Promise<PangkalanLpg> {
    const pangkalanLpg = this.pangkalanLpgRepository.create(dto);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      pangkalanLpg.latitude = lat;
      pangkalanLpg.longitude = lng;
    }

    return this.pangkalanLpgRepository.save(pangkalanLpg);
  }

  async findAll(): Promise<PangkalanLpg[]> {
    return this.pangkalanLpgRepository.find({ relations: ['kecamatan', 'kelurahan'] });
  }

  async findOne(id: number): Promise<PangkalanLpg> {
    const pangkalanLpg = await this.pangkalanLpgRepository.findOne({
      where: { id_pangkalan_lpg: id },
      relations: ['kecamatan', 'kelurahan'],
    });

    if (!pangkalanLpg) {
      throw new NotFoundException(`Pangkalan LPG dengan ID ${id} tidak ditemukan`);
    }

    return pangkalanLpg;
  }

  async update(id: number, dto: UpdatePangkalanLpgDto): Promise<PangkalanLpg> {
    const pangkalanLpg = await this.findOne(id);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      dto.latitude = lat;
      dto.longitude = lng;
    }

    Object.assign(pangkalanLpg, dto);
    return this.pangkalanLpgRepository.save(pangkalanLpg);
  }

  async remove(id: number): Promise<void> {
    const pangkalanLpg = await this.findOne(id);
    await this.pangkalanLpgRepository.remove(pangkalanLpg);
  }
}