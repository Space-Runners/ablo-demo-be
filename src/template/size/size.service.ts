import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './size.entity';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly repo: Repository<Size>,
  ) {}

  async findAll(): Promise<Size[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Size> {
    return this.repo.findOneBy({ id });
  }
}
