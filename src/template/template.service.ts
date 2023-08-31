import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly repo: Repository<Template>,
  ) {}

  async findOne(id: string): Promise<Template> {
    const item = await this.repo.findOne({
      where: { id: Equal(id) },
      relations: ['sides', 'sizes', 'colors.images', 'currency'],
    });

    if (!item) {
      throw new NotFoundException('Template not found');
    }

    return item;
  }

  async findAll(take: number, skip: number): Promise<Template[]> {
    const templates = this.repo.find({
      // where: { userId },
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['sides', 'sizes', 'colors.images', 'currency'],
    });
    return templates;
  }
}
