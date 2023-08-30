import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateSide } from './template-side.entity';
import { Equal, Repository } from 'typeorm';
import { TemplateSideDto, UpdateTemplateSideDto } from './template-side.dto';
import { TemplateService } from '../template.service';

@Injectable()
export class TemplateSideService {
  constructor(
    @InjectRepository(TemplateSide)
    private readonly repo: Repository<TemplateSide>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
  ) {}

  async findOne(id: string): Promise<TemplateSide> {
    const item = await this.repo.findOne({
      where: { id: Equal(id) },
      relations: ['images'],
    });

    if (!item) {
      throw new NotFoundException('TemplateSide not found');
    }

    return item;
  }

  async findAll(
    take: number,
    skip: number,
    templateId: string,
  ): Promise<TemplateSide[]> {
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
    dto: TemplateSideDto,
    templateId: string,
  ): Promise<TemplateSide> {
    await this.templateService.findOne(templateId);
    return await this.repo.save({ ...dto, templateId });
  }

  async update(id: string, dto: UpdateTemplateSideDto): Promise<TemplateSide> {
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
