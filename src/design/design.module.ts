import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Design } from './design.entity';
import { DesignController } from './design.controller';
import { DesignService } from './design.service';
import { StorageService } from '../storage.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Design])],
  controllers: [DesignController],
  providers: [StorageService, DesignService],
  exports: [DesignService],
})
export class DesignModule {}
