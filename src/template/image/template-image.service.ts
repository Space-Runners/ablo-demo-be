import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateImage } from './template-image.entity';
import { Equal, Repository } from 'typeorm';
import { TemplateImageDto, UpdateTemplateImageDto } from './template-image.dto';
import { TemplateService } from '../template.service';
import { StorageService } from '../../generator/storage.service';
import { Client } from '../../clients/client.entity';

@Injectable()
export class TemplateImageService {
  constructor(
    @InjectRepository(TemplateImage)
    private readonly repo: Repository<TemplateImage>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    private readonly uploaderService: StorageService,
  ) {}

  async checkClientAuth(id: string, client: Client) {
    const templateImage = await this.findOne(id);
    const template = await this.templateService.findOne(
      templateImage.templateSide.templateId,
    );
    if (template.clientId !== client.id) {
      throw new ForbiddenException('Client does not own template');
    }
  }

  async findOne(id: string): Promise<TemplateImage> {
    // Find
    const item = await this.repo.findOne({
      where: { id: Equal(id) },
    });
    if (!item) {
      throw new NotFoundException('TemplateImage not found');
    }
    return item;
  }

  async findAll(
    take: number,
    skip: number,
    templateColorId: string,
  ): Promise<TemplateImage[]> {
    // Find
    const items = this.repo.find({
      where: { templateColorId },
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
      relations: ['templateColor', 'templateSide'],
    });

    return items;
  }

  async upload(image: string): Promise<string> {
    const meta = image?.split(';')[0];
    if (meta) {
      const fileInfo = meta.split('/');
      if (fileInfo.length > 1) {
        const extension = fileInfo[1];
        const buffer = Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ''),
          'base64',
        );
        const fileName = `${Date.now()}.${extension}`;
        const fileUrl = await this.uploaderService.uploadFile(
          buffer,
          fileName,
          `template-images`,
        );
        return fileUrl;
      }
    }
    throw new BadRequestException('Missing or incorrect image metadata');
  }

  async create(dto: TemplateImageDto): Promise<TemplateImage> {
    // Check if already exists
    const item = await this.repo.findOne({
      where: {
        templateColorId: Equal(dto.templateColorId),
        templateSideId: Equal(dto.templateSideId),
      },
    });
    if (item) {
      throw new ConflictException(
        'Template for this color-side already exists. Did you mean to PATCH?',
      );
    }
    const url = await this.upload(dto?.image);
    delete dto.image;
    return await this.repo.save({ ...dto, url });
  }

  async update(
    id: string,
    dto: UpdateTemplateImageDto,
  ): Promise<TemplateImage> {
    const old = await this.findOne(id);
    const patch: any = { ...dto };
    if (patch?.image) {
      patch.url = await this.upload(patch?.image);
      delete patch.image;
      if (old?.url) {
        await this.uploaderService.removeFile(old.url);
      }
    }
    if (Object.keys(patch).length > 0) {
      await this.repo.update({ id }, patch);
    }
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    // Validate
    const old = await this.findOne(id);
    await this.repo.delete({ id });
    if (old?.url) {
      await this.uploaderService.removeFile(old.url);
    }
  }
}
