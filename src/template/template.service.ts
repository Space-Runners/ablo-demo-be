import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { Equal, Repository } from 'typeorm';
import { TemplateDto, UpdateTemplateDto } from './template.dto';
import { Size } from './size/size.entity';
import { Client } from '../clients/client.entity';
import { TemplateFullDto } from './template-full.dto';
import { TemplateColorService } from './color/template-color.service';
import { TemplateSideService } from './side/template-side.service';
import { TemplateImageService } from './image/template-image.service';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly repo: Repository<Template>,
    @InjectRepository(Size)
    private readonly repoSize: Repository<Size>,
    @Inject(forwardRef(() => TemplateColorService))
    private readonly templateColorService: TemplateColorService,
    @Inject(forwardRef(() => TemplateImageService))
    private readonly templateImageService: TemplateImageService,
    @Inject(forwardRef(() => TemplateSideService))
    private readonly templateSideService: TemplateSideService,
  ) {}

  async checkClientAuth(templateId: string, client: Client) {
    const template = await this.findOne(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (template.clientId !== client.id) {
      throw new ForbiddenException('Client does not own template');
    }
  }

  async dtoToEntity(dto: UpdateTemplateDto) {
    const entity: any = { ...dto };
    if (Array.isArray(dto.sizeIds)) {
      entity.sizes = await Promise.all(
        dto.sizeIds?.map(async (id) => await this.repoSize.findOneBy({ id })),
      );
    }
    delete entity.sizeIds;
    return entity;
  }

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

  async findAll(
    take: number,
    skip: number,
    clientId: string,
  ): Promise<Template[]> {
    const templates = this.repo.find({
      where: { clientId },
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['sides', 'sizes', 'colors.images', 'currency'],
    });
    return templates;
  }

  async create(dto: TemplateDto, clientId: string): Promise<Template> {
    const template: Template = {
      ...(await this.dtoToEntity(dto)),
      clientId,
    };

    template.client = { id: clientId } as Client;

    return await this.repo.save(template);
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    let item = await this.findOne(id);
    const patch = await this.dtoToEntity(dto);
    item = {
      ...item,
      ...patch,
    };
    await this.repo.save(item);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    // Try to get (also checks for autorization)
    await this.findOne(id);
    await this.repo.delete({ id });
  }

  async createFull(dto: TemplateFullDto, clientId: string): Promise<Template> {
    const processsedDto = await this.dtoToEntity(dto);
    const { sides, colors } = processsedDto;
    delete processsedDto.sides;
    delete processsedDto.colors;

    const template: Template = {
      ...processsedDto,
      clientId,
    };

    template.client = { id: clientId } as Client;

    await this.repo.save(template);

    const templateSides = [];
    for (const side of sides) {
      templateSides.push(
        await this.templateSideService.create(side, template.id),
      );
    }

    const templateColors = [];
    for (const color of colors) {
      const images = color.images;
      delete color.images;

      const templateColor = await this.templateColorService.create(
        color,
        template.id,
      );

      for (const side in images) {
        // Find id of templateSide which has the same name as the image
        const templateSide = templateSides.find(
          (templateSide) => templateSide.name === side,
        );

        if (!templateSide) {
          throw new NotFoundException('Template side not found');
        }

        await this.templateImageService.create({
          templateSideId: templateSide.id,
          templateColorId: templateColor.id,
          image: images[side],
        });
      }

      templateColors.push(templateColor);
    }

    const fullTemplate = await this.findOne(template.id);

    return fullTemplate;
  }
}
