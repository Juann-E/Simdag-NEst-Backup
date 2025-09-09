import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamPhoto } from './team-photo.entity';
import { CreateTeamPhotoDto } from './dto/create-team-photo.dto';
import { UpdateTeamPhotoDto } from './dto/update-team-photo.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamPhotoService {
  constructor(
    @InjectRepository(TeamPhoto)
    private teamPhotoRepo: Repository<TeamPhoto>,
  ) {}

  async create(dto: CreateTeamPhotoDto): Promise<TeamPhoto> {
    // Cek apakah member_id sudah ada
    const existingMember = await this.teamPhotoRepo.findOne({
      where: { member_id: dto.member_id }
    });

    if (existingMember) {
      throw new ConflictException(`Anggota tim dengan ID '${dto.member_id}' sudah ada`);
    }

    const teamPhoto = this.teamPhotoRepo.create(dto);
    return await this.teamPhotoRepo.save(teamPhoto);
  }

  async findAll(): Promise<TeamPhoto[]> {
    return await this.teamPhotoRepo.find({
      order: { created_at: 'DESC' }
    });
  }

  async findActive(): Promise<TeamPhoto[]> {
    return await this.teamPhotoRepo.find({
      where: { is_active: true },
      order: { created_at: 'DESC' }
    });
  }

  async findByMemberId(memberId: string): Promise<TeamPhoto> {
    const teamPhoto = await this.teamPhotoRepo.findOne({
      where: { member_id: memberId }
    });

    if (!teamPhoto) {
      throw new NotFoundException(`Anggota tim dengan member ID '${memberId}' tidak ditemukan`);
    }

    return teamPhoto;
  }

  async findOne(id: number): Promise<TeamPhoto> {
    const teamPhoto = await this.teamPhotoRepo.findOne({ where: { id } });
    if (!teamPhoto) {
      throw new NotFoundException(`Anggota tim dengan ID ${id} tidak ditemukan`);
    }
    return teamPhoto;
  }



  async update(id: number, dto: UpdateTeamPhotoDto, file?: Express.Multer.File): Promise<TeamPhoto> {
    const teamPhoto = await this.findOne(id);
    
    // Jika ada perubahan member_id, cek duplikasi
    if (dto.member_id && dto.member_id !== teamPhoto.member_id) {
      const existingMember = await this.teamPhotoRepo.findOne({
        where: { member_id: dto.member_id }
      });
      if (existingMember) {
        throw new ConflictException(`Anggota tim dengan ID '${dto.member_id}' sudah ada`);
      }
    }

    // Handle file upload
    if (file) {
      // Hapus foto lama jika ada foto baru
      if (teamPhoto.photo) {
        this.deletePhotoFile(teamPhoto.photo);
      }
      dto.photo = file.path;
    }

    Object.assign(teamPhoto, dto);
    return await this.teamPhotoRepo.save(teamPhoto);
  }

  async updateByMemberId(memberId: string, dto: UpdateTeamPhotoDto, file?: Express.Multer.File): Promise<TeamPhoto> {
    let teamPhoto = await this.teamPhotoRepo.findOne({
      where: { member_id: memberId }
    });

    // If team photo doesn't exist, create it
    if (!teamPhoto) {
      const createDto = {
        member_id: memberId,
        name: dto.name || '',
        position: dto.position || '',
        category: dto.category || '',
        nip: dto.nip || '',
        responsibilities: dto.responsibilities || '',
        is_active: dto.is_active ?? true,
      };
      
      if (file) {
        createDto['photo'] = file.path;
      }
      
      return await this.teamPhotoRepo.save(createDto);
    }

    // Handle file upload
    if (file) {
      // Hapus foto lama jika ada
      if (teamPhoto.photo) {
        this.deletePhotoFile(teamPhoto.photo);
      }
      dto.photo = file.path;
    }

    Object.assign(teamPhoto, dto);
    return await this.teamPhotoRepo.save(teamPhoto);
  }

  async updatePhoto(member_id: string, photoPath: string): Promise<TeamPhoto> {
    const teamPhoto = await this.findByMemberId(member_id);
    
    // Hapus foto lama jika ada
    if (teamPhoto.photo) {
      this.deletePhotoFile(teamPhoto.photo);
    }

    teamPhoto.photo = photoPath;
    return await this.teamPhotoRepo.save(teamPhoto);
  }

  async remove(id: number): Promise<void> {
    const teamPhoto = await this.findOne(id);
    
    // Hapus file foto jika ada
    if (teamPhoto.photo) {
      this.deletePhotoFile(teamPhoto.photo);
    }

    await this.teamPhotoRepo.remove(teamPhoto);
  }

  async removeByMemberId(memberId: string): Promise<void> {
    const teamPhoto = await this.teamPhotoRepo.findOne({
      where: { member_id: memberId }
    });

    if (!teamPhoto) {
      throw new NotFoundException(`Anggota tim dengan member ID '${memberId}' tidak ditemukan`);
    }

    // Hapus file foto jika ada
    if (teamPhoto.photo) {
      this.deletePhotoFile(teamPhoto.photo);
    }

    await this.teamPhotoRepo.remove(teamPhoto);
  }

  private deletePhotoFile(photoPath: string): void {
    try {
      const fullPath = path.resolve(photoPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('Error deleting photo file:', error);
    }
  }
}