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
    if (!input || typeof input !== 'string') {
      throw new Error('Input koordinat tidak valid atau kosong');
    }

    // buang spasi ekstra
    const clean = input.trim().replace(/\s+/g, '');
    
    if (!clean) {
      throw new Error('Input koordinat kosong setelah dibersihkan');
    }

    // cek kalau sudah decimal format: "-7.32,110.50"
    if (clean.includes(',')) {
      const parts = clean.split(',');
      if (parts.length === 2 && !parts[0].includes('°') && !parts[1].includes('°')) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error(`Koordinat decimal tidak valid: lat=${parts[0]}, lng=${parts[1]}`);
        }
        
        // Validasi range koordinat
        if (lat < -90 || lat > 90) {
          throw new Error(`Latitude di luar range (-90 sampai 90): ${lat}`);
        }
        if (lng < -180 || lng > 180) {
          throw new Error(`Longitude di luar range (-180 sampai 180): ${lng}`);
        }
        
        return { lat, lng };
      }
    }

    // fungsi helper untuk konversi DMS ke decimal
    const dmsToDecimal = (dms: string): number => {
      const regex = /(\d+)°(\d+)'([\d.]+)"?([NSEW])/;
      const match = dms.match(regex);
      if (!match) throw new Error(`Format koordinat DMS tidak valid: ${dms}`);

      const [, deg, min, sec, dir] = match;
      let decimal = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
      if (dir === 'S' || dir === 'W') decimal *= -1;
      return decimal;
    };

    // kalau ada koma berarti format DMS pakai pemisah koma
    if (clean.includes(',')) {
      const [latStr, lngStr] = clean.split(',');
      if (latStr && lngStr) {
        return { lat: dmsToDecimal(latStr), lng: dmsToDecimal(lngStr) };
      }
    }

    // kalau tidak ada koma → asumsikan dipisah dengan spasi
    const parts = clean.split(/(?=[NSWE])/);
    if (parts.length === 2) {
      return { lat: dmsToDecimal(parts[0]), lng: dmsToDecimal(parts[1]) };
    }

    throw new Error(`Format koordinat tidak dikenali: "${input}". Gunakan format decimal (-7.32,110.50) atau DMS (7°19'48"S,110°30'18"E)`);
  }


  async create(dto: CreateNamaPasarDto): Promise<NamaPasar> {
    const pasar = this.namaPasarRepo.create(dto);

    // parsing koordinat jika ada
    if (dto.koordinat && dto.koordinat.trim()) {
      try {
        const { lat, lng } = this.parseCoordinate(dto.koordinat);
        pasar.latitude = lat;
        pasar.longitude = lng;
        console.log(`✅ Koordinat berhasil diparse: lat=${lat}, lng=${lng}`);
      } catch (error) {
        console.error(`❌ Error parsing koordinat "${dto.koordinat}":`, error.message);
        // Jangan throw error, biarkan data tersimpan tanpa koordinat
        console.log('⚠️ Data akan disimpan tanpa koordinat');
      }
    }

    return this.namaPasarRepo.save(pasar);
  }

  async update(id: number, dto: UpdateNamaPasarDto): Promise<NamaPasar> {
    const pasar = await this.findOne(id);
    Object.assign(pasar, dto);

    if (dto.koordinat && dto.koordinat.trim()) {
      try {
        const { lat, lng } = this.parseCoordinate(dto.koordinat);
        pasar.latitude = lat;
        pasar.longitude = lng;
        console.log(`✅ Koordinat berhasil diparse: lat=${lat}, lng=${lng}`);
      } catch (error) {
        console.error(`❌ Error parsing koordinat "${dto.koordinat}":`, error.message);
        // Jangan throw error, biarkan data tersimpan tanpa koordinat
        console.log('⚠️ Data akan disimpan tanpa koordinat');
      }
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
