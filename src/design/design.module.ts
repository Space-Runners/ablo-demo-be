import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Design } from './design.entity';
import { DesignController } from './design.controller';
import { DesignService } from './design.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Design])],
  controllers: [DesignController],
  providers: [DesignService],
  exports: [DesignService],
})
export class DesignModule {}
