import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ApiKey } from './api-key.entity';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ConfigModule } from '@nestjs/config';
import { GeneratorService } from '../generator/generator.service';
import { StorageService } from '../generator/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ApiKey]), ConfigModule],
  controllers: [ClientController],
  providers: [GeneratorService, StorageService, ClientService],
  exports: [ClientService],
})
export class ClientModule {}
