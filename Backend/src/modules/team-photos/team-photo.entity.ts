import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('team_photos')
export class TeamPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  member_id: string; // ID unik untuk setiap anggota tim (misal: 'agung-pitoyo')

  @Column({ type: 'varchar', length: 150 })
  name: string; // Nama lengkap anggota tim

  @Column({ type: 'varchar', length: 100 })
  position: string; // Jabatan

  @Column({ type: 'varchar', length: 50 })
  category: string; // Kategori (Penanggung Jawab, Ketua, dll)

  @Column({ type: 'varchar', length: 20, nullable: true })
  nip: string; // Nomor Induk Pegawai

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string; // Path ke file foto

  @Column({ type: 'text', nullable: true })
  responsibilities: string; // Tanggung jawab/tugas

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // Status aktif/tidak aktif

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}