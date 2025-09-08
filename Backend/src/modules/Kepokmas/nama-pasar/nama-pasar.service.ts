import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NamaPasar } from './nama-pasar.entity';
import { CreateNamaPasarDto } from './dto/create-nama-pasar.dto';
import { UpdateNamaPasarDto } from './dto/update-nama-pasar.dto';

@Injectable()
export class NamaPasarService {
  constructor(
    @InjectRepository(NamaPasar)
    private namaPasarRepo: Repository<NamaPasar>,
  ) { }

  private parseCoordinate(input: string): { lat: number, lng: number } {
    // buang spasi ekstra
    const clean = input.replace(/\s+/g, '');

    // cek kalau sudah decimal format: "-7.32,110.50"
    if (clean.includes(',')) {
      const parts = clean.split(',');
      if (!parts[0].includes('°') && !parts[1].includes('°')) {
        return {
          lat: parseFloat(parts[0]),
          lng: parseFloat(parts[1]),
        };
      }
    }

    // fungsi helper untuk konversi DMS ke decimal
    const dmsToDecimal = (dms: string): number => {
      const regex = /(\d+)°(\d+)'([\d.]+)"?([NSEW])/;
      const match = dms.match(regex);
      if (!match) throw new Error(`Format koordinat tidak valid: ${dms}`);

      const [, deg, min, sec, dir] = match;
      let decimal = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
      if (dir === 'S' || dir === 'W') decimal *= -1;
      return decimal;
    };

    // kalau ada koma berarti format DMS pakai pemisah koma
    if (clean.includes(',')) {
      const [latStr, lngStr] = clean.split(',');
      return { lat: dmsToDecimal(latStr), lng: dmsToDecimal(lngStr) };
    }

    // kalau tidak ada koma → asumsikan dipisah dengan spasi
    const parts = clean.split(/(?=[NSWE])/); // potong di huruf arah
    if (parts.length === 2) {
      return { lat: dmsToDecimal(parts[0]), lng: dmsToDecimal(parts[1]) };
    }

    throw new Error(`Format koordinat tidak dikenali: ${input}`);
  }


  async create(dto: CreateNamaPasarDto): Promise<NamaPasar> {
    const pasar = this.namaPasarRepo.create(dto);

    // parsing koordinat jika ada
    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      pasar.latitude = lat;
      pasar.longitude = lng;
    }

    return this.namaPasarRepo.save(pasar);
  }

  async update(id: number, dto: UpdateNamaPasarDto): Promise<NamaPasar> {
    const pasar = await this.findOne(id);
    Object.assign(pasar, dto);

    if (dto.koordinat) {
      const { lat, lng } = this.parseCoordinate(dto.koordinat);
      pasar.latitude = lat;
      pasar.longitude = lng;
    }

    return this.namaPasarRepo.save(pasar);
  }

  async findAll(): Promise<NamaPasar[]> {
    return this.namaPasarRepo.find();
  }

  async findOne(id: number): Promise<NamaPasar> {
    const pasar = await this.namaPasarRepo.findOne({ where: { id } });
    if (!pasar) throw new NotFoundException(`NamaPasar with id ${id} not found`);
    return pasar;
  }

  async remove(id: number): Promise<void> {
    const pasar = await this.findOne(id);
    await this.namaPasarRepo.remove(pasar);
  }
}
