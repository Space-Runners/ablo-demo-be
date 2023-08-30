import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { TemplateColor } from './template-color.entity';
import { TemplateColorDto, UpdateTemplateColorDto } from './template-color.dto';
import { TemplateService } from '../template.service';

@Injectable()
export class TemplateColorService {
  constructor(
    @InjectRepository(TemplateColor)
    private readonly repo: Repository<TemplateColor>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
  ) {}

  async findOne(id: string): Promise<TemplateColor> {
    const item = await this.repo.findOne({
      where: { id: Equal(id) },
      relations: ['images'],
    });

    if (!item) {
      throw new NotFoundException('TemplateColor not found');
    }

    return item;
  }

  async findAll(
    take: number,
    skip: number,
    templateId: string,
  ): Promise<TemplateColor[]> {
    // Validate
    await this.templateService.findOne(templateId);
    // Find
    const items = this.repo.find({
      where: { templateId },
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['images'],
    });

    return items;
  }

  async create(
    dto: TemplateColorDto,
    templateId: string,
  ): Promise<TemplateColor> {
    // Validate
    await this.templateService.findOne(templateId);
    return await this.repo.save({ ...dto, templateId });
  }

  async update(
    id: string,
    dto: UpdateTemplateColorDto,
  ): Promise<TemplateColor> {
    // Validate
    await this.findOne(id);
    await this.repo.update({ id }, dto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    // Validate
    await this.findOne(id);
    await this.repo.delete({ id });
  }
}
