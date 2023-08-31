import { ConfigModule } from '@nestjs/config';
import { Template } from './template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { StorageService } from '../generator/storage.service';
import { Size } from './size/size.entity';
import { Currency } from './currency/currency.entity';
import { TemplateSide } from './side/template-side.entity';
import { TemplateColor } from './color/template-color.entity';
import { TemplateImage } from './image/template-image.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Currency,
      Size,
      Template,
      TemplateColor,
      TemplateImage,
      TemplateSide,
    ]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService, StorageService],
  exports: [TemplateService],
})
export class TemplateModule {}
