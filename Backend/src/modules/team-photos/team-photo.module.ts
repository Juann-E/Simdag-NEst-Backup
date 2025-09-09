import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPhoto } from './team-photo.entity';
import { TeamPhotoService } from './team-photo.service';
import { TeamPhotoController } from './team-photo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamPhoto])],
  controllers: [TeamPhotoController],
  providers: [TeamPhotoService],
  exports: [TeamPhotoService],
})
export class TeamPhotoModule {}