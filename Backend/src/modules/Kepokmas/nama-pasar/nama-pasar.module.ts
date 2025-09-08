import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamaPasarService } from './nama-pasar.service';
import { NamaPasarController } from './nama-pasar.controller';
import { NamaPasar } from './nama-pasar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NamaPasar])],
  providers: [NamaPasarService],
  controllers: [NamaPasarController],
})
export class NamaPasarModule {}
