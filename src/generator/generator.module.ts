import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { Image } from './image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../configuration/configuration.entity';
import { ImagesController } from './image.controller';
import { ImageService } from './image.service';
import { ClientService } from '../clients/client.service';
import { Client } from '../clients/client.entity';
import { ApiKey } from '../clients/api-key.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ApiKey, Client, Image, Configuration]),
  ],
  controllers: [GeneratorController, ImagesController],
  providers: [ClientService, GeneratorService, StorageService, ImageService],
})
export class GeneratorModule {}
