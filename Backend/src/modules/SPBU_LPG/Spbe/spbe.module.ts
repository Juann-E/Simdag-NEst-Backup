import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spbe } from './spbe.entity';
import { SpbeService } from './spbe.service';
import { SpbeController } from './spbe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Spbe])],
  controllers: [SpbeController],
  providers: [SpbeService],
  exports: [SpbeService],
})
export class SpbeModule {}