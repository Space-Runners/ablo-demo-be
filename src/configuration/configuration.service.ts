import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './configuration.entity';
import { ConfigDto } from './config.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  async getAll() {
    return this.configurationRepository.find();
  }

  async getOne(id: number) {
    return this.configurationRepository.findOneBy({ id });
  }

  async create(newConfig: ConfigDto): Promise<any> {
    return this.configurationRepository.save(newConfig);
  }

  async update(id: number, newConfig: ConfigDto): Promise<any> {
    return this.configurationRepository.update(id, newConfig);
  }

  async delete(id: number): Promise<any> {
    return this.configurationRepository.delete({ id });
  }
}
