import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Agen } from '../../SPBU_LPG/Agen/agen.entity';

// Entity untuk tabel utama realisasi_bulanan_lpg
@Entity('realisasi_bulanan_lpg')
export class RealisasiBulananLpgMain {
  @PrimaryGeneratedColumn({ name: 'id_realisasi_lpg' })
  id_realisasi_lpg: number;

  @Column({ name: 'id_agen' })
  id_agen: number;

  @Column({ name: 'keterangan', type: 'text', nullable: true })
  keterangan: string;

  // Relations
  @ManyToOne(() => Agen)
  @JoinColumn({ name: 'id_agen' })
  agen: Agen;
}

// Entity untuk tabel detail realisasi_bulanan_lpg_detail
@Entity('realisasi_bulanan_lpg_detail')
export class RealisasiBulananLpg {
  @PrimaryGeneratedColumn({ name: 'id_detail' })
  id_detail: number;

  @Column({ name: 'id_realisasi_lpg' })
  id_realisasi_lpg: number;

  @Column({ name: 'bulan', type: 'int' })
  bulan: number;

  @Column({ name: 'tahun', type: 'int' })
  tahun: number;

  @Column({ name: 'realisasi_tabung', type: 'int' })
  realisasi_tabung: number;

  // Relations
  @ManyToOne(() => RealisasiBulananLpgMain)
  @JoinColumn({ name: 'id_realisasi_lpg' })
  realisasiMain: RealisasiBulananLpgMain;

  // Computed property untuk mendapatkan agen
  get agen(): Agen {
    return this.realisasiMain?.agen;
  }
}