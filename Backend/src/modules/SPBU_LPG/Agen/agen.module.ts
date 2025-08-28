import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agen } from './agen.entity';
import { AgenService } from './agen.service';
import { AgenController } from './agen.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agen])],
  controllers: [AgenController],
  providers: [AgenService],
  exports: [AgenService],
})
export class AgenModule {}