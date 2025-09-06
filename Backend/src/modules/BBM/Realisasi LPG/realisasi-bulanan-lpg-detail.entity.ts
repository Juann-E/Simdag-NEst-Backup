import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RealisasiBulananLpg } from './realisasi-bulanan-lpg.entity';

@Entity('realisasi_bulanan_lpg_detail')
export class RealisasiBulananLpgDetail {
  @PrimaryGeneratedColumn({ name: 'id_detail' })
  id_detail: number;

  @Column({ name: 'id_realisasi_lpg' })
  id_realisasi_lpg: number;

  @Column({ name: 'bulan', type: 'int' })
  bulan: number;

  @Column({ name: 'tahun', type: 'int' })
  tahun: number;

  @Column({ name: 'realisasi_tabung', type: 'int', default: 0 })
  realisasi_tabung: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => RealisasiBulananLpg)
  @JoinColumn({ name: 'id_realisasi_lpg' })
  realisasi_lpg: RealisasiBulananLpg;
}