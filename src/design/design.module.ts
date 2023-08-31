import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Design } from './design.entity';
import { DesignController } from './design.controller';
import { DesignService } from './design.service';
import { StorageService } from '../generator/storage.service';
import { DesignSideController } from './side/design-side.controller';
import { DesignSideService } from './side/design-side.service';
import { DesignSide } from './side/design-side.entity';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Design, DesignSide]),
    TemplateModule,
  ],
  controllers: [DesignController, DesignSideController],
  providers: [DesignSideService, StorageService, DesignService],
  exports: [DesignService],
})
export class DesignModule {}
