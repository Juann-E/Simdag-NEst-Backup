import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Kecamatan } from '../../Setting/Kecamatan/kecamatan.entity';
import { Kelurahan } from '../../Setting/Kelurahan/kelurahan.entity';

@Entity('distributor')
export class Distributor {
  @PrimaryGeneratedColumn({ name: 'id_distributor' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nama_distributor: string;

  @Column({ name: 'id_kecamatan' })
  id_kecamatan: number;

  @Column({ name: 'id_kelurahan' })
  id_kelurahan: number;

  @Column({ type: 'text' })
  alamat: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  koordinat: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @CreateDateColumn({ name: 'time_stamp' })
  time_stamp: Date;

  // Relasi dengan Kecamatan
  @ManyToOne(() => Kecamatan)
  @JoinColumn({ name: 'id_kecamatan' })
  kecamatan: Kecamatan;

  // Relasi dengan Kelurahan
  @ManyToOne(() => Kelurahan)
  @JoinColumn({ name: 'id_kelurahan' })
  kelurahan: Kelurahan;

  // Virtual properties untuk nama kecamatan dan kelurahan
  get nama_kecamatan(): string {
    return this.kecamatan?.nama_kecamatan || '';
  }

  get nama_kelurahan(): string {
    return this.kelurahan?.nama_kelurahan || '';
  }

  @BeforeInsert()
  @BeforeUpdate()
  parseKoordinat() {
    if (this.koordinat) {
      const coords = this.koordinat.split(',').map(coord => coord.trim());
      if (coords.length === 2) {
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          this.latitude = lat;
          this.longitude = lng;
        }
      }
    }
  }
}