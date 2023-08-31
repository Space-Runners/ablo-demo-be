import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Design } from './design.entity';
import { CreateDesignDto } from './create-design.dto';
import { User } from '../user/user.entity';
import { TemplateService } from '../template/template.service';
import { PatchDesignDto } from './patch-design.dto';

@Injectable()
export class DesignService {
  constructor(
    @InjectRepository(Design)
    private readonly repo: Repository<Design>,
    private readonly templateService: TemplateService,
  ) {}

  public async getUserDesign(id: string, userId: string) {
    const design = await this.getOne(id);
    if (!design || design.userId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return design;
  }

  async patch(design: Design, patchDesignDto: PatchDesignDto) {
    // const { name, templateColorId, templateId, sizeId } = patchDesignDto;
    // if (name) {
    //   design.name = name;
    // }
    // if (templateColorId) {
    //   const templateColor = await this.templateColorService.findOne(
    //     templateColorId,
    //   );
    //   if (!templateColor) {
    //     throw new HttpException('Color not found', HttpStatus.BAD_REQUEST);
    //   }
    //   design.color = templateColor;
    // }
    // if (templateId) {
    //   const template = await this.templateService.findOne(templateId);
    //   if (!template) {
    //     throw new HttpException('Template not found', HttpStatus.BAD_REQUEST);
    //   }
    //   design.template = template;
    // }
    // if (sizeId) {
    //   const size = design.template.sizes.find((s) => s.id === sizeId);
    //   if (!size) {
    //     throw new HttpException('Size not found', HttpStatus.BAD_REQUEST);
    //   }
    //   design.size = size;
    // }
    // await this.repo.save(design);
  }

  async getAll() {
    return this.repo.find();
  }

  async getAllForUser(userId: string) {
    return this.repo.findBy({ userId });
  }

  async getOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['client', 'template'],
    });
  }

  async create(designDto: CreateDesignDto, user: User): Promise<Design> {
    // const template = await this.templateService.findOne(designDto.templateId);

    // const { name, templateColorId, sizeId } = designDto;

    // if (!template.colors || template.colors.length === 0) {
    //   throw new HttpException('Template has no colors', HttpStatus.BAD_REQUEST);
    // }

    // const color = template.colors.find((c) => c.id === templateColorId);

    // if (!color) {
    //   throw new HttpException('Color not found', HttpStatus.BAD_REQUEST);
    // }

    // const size = template.sizes.find((s) => s.id === sizeId);
    // if (!size) {
    //   throw new HttpException('Size not found', HttpStatus.BAD_REQUEST);
    // }

    const design: Design = await this.repo.save(designDto);

    return design;
  }

  async update(id: string, design: CreateDesignDto): Promise<void> {
    // const template = await this.templateService.findOne(design.templateId);
    // // TODO: This should be called for design sides I think
    // // design = await this.updateEditorState(design, clientId);
    // const { name, templateColorId, sizeId } = design;
    // const color = await this.templateColorService.findOne(templateColorId);
    // if (!color) {
    //   throw new HttpException('Color not found', HttpStatus.BAD_REQUEST);
    // }
    // const size = template.sizes.find((s) => s.id === sizeId);
    // if (!size) {
    //   throw new HttpException('Size not found', HttpStatus.BAD_REQUEST);
    // }
    // await this.repo.update(id, {
    //   name,
    //   color,
    // });
  }

  async delete(id: string): Promise<any> {
    return this.repo.delete({ id });
  }
}
