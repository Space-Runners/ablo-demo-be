import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  imports: [ConfigModule],
  controllers: [GeneratorController],
  providers: [GeneratorService, StorageService],
})
export class GeneratorModule {}
