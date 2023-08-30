import { ConfigModule } from '@nestjs/config';
import { Template } from './template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { StorageService } from '../generator/storage.service';
import { ClientService } from '../clients/client.service';
import { Client } from '../clients/client.entity';
import { ApiKey } from '../clients/api-key.entity';
import { Size } from './size/size.entity';
import { SizeController } from './size/size.controller';
import { SizeService } from './size/size.service';
import { Currency } from './currency/currency.entity';
import { CurrencyService } from './currency/currency.service';
import { CurrencyController } from './currency/currency.controller';
import { TemplateSideController } from './side/template-side.controller';
import { TemplateSideService } from './side/template-side.service';
import { TemplateSide } from './side/template-side.entity';
import { TemplateColorController } from './color/template-color.controller';
import { TemplateColorService } from './color/template-color.service';
import { TemplateColor } from './color/template-color.entity';
import { TemplateImageService } from './image/template-image.service';
import { TemplateImageController } from './image/template-image.controller';
import { TemplateImage } from './image/template-image.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ApiKey,
      Client,
      Currency,
      Size,
      Template,
      TemplateColor,
      TemplateImage,
      TemplateSide,
    ]),
  ],
  controllers: [
    CurrencyController,
    TemplateController,
    TemplateColorController,
    TemplateImageController,
    TemplateSideController,
    SizeController,
  ],
  providers: [
    ClientService,
    CurrencyService,
    TemplateService,
    TemplateImageService,
    TemplateColorService,
    TemplateSideService,
    SizeService,
    StorageService,
  ],
  exports: [
    CurrencyService,
    TemplateService,
    TemplateColorService,
    TemplateImageService,
    TemplateSideService,
    SizeService,
  ],
})
export class TemplateModule {}
