import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DesignService } from '../design.service';
import { CreateDesignSideDto } from './create-design-side.dto';
import { DesignSide } from './design-side.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from '../../generator/storage.service';
import { PatchDesignSideDto } from './patch-design-side.dto';

@Injectable()
export class DesignSideService {
  constructor(
    @InjectRepository(DesignSide)
    private readonly repo: Repository<DesignSide>,
    private readonly designService: DesignService,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateDesignSideDto, designId: string, clientId: string) {
    // const design = await this.designService.getOne(designId);
    // const side: DesignSide = await this.repo.create(dto);
    // side.design = design;
    // side.imageUrl = await this.storageService.uploadFile(
    //   Buffer.from(dto.image.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
    //   `design-images/${Date.now()}.png`,
    //   clientId,
    // );
    // side.previewUrl = await this.storageService.uploadFile(
    //   Buffer.from(
    //     dto.preview.replace(/^data:image\/\w+;base64,/, ''),
    //     'base64',
    //   ),
    //   `design-previews/${Date.now()}.png`,
    //   clientId,
    // );
    // side.canvasStateUrl = await this.storageService.uploadFile(
    //   Buffer.from(dto.canvasState),
    //   `${Date.now()}.json`,
    //   clientId,
    // );
    // side.templateSide = await this.templateSideService.findOne(
    //   dto.templateSideId,
    // );
    // side.hasGraphics = dto.hasGraphics;
    // side.hasText = dto.hasText;
    // return this.repo.save(side);
  }

  async getAll(designId: string): Promise<DesignSide[]> {
    return this.repo.find({
      where: { design: { id: designId } },
    });
  }

  async getOne(id: string): Promise<DesignSide> {
    const designSide = await this.repo.findOneBy({ id });

    if (!designSide) {
      throw new NotFoundException('Design side not found');
    }

    return designSide;
  }

  async patch(dto: PatchDesignSideDto, id: string, clientId: string) {
    //   const side: DesignSide = await this.repo.findOneBy({ id });
    //   if (!side) {
    //     throw new NotFoundException('Design side not found');
    //   }
    //   if (dto.image) {
    //     await this.storageService.removeFile(side.imageUrl);
    //     side.imageUrl = await this.storageService.uploadFile(
    //       Buffer.from(
    //         dto.image.replace(/^data:image\/\w+;base64,/, ''),
    //         'base64',
    //       ),
    //       `design-images/${Date.now()}.png`,
    //       clientId,
    //     );
    //   }
    //   if (dto.preview) {
    //     await this.storageService.removeFile(side.previewUrl);
    //     side.previewUrl = await this.storageService.uploadFile(
    //       Buffer.from(
    //         dto.preview.replace(/^data:image\/\w+;base64,/, ''),
    //         'base64',
    //       ),
    //       `design-previews/${Date.now()}.png`,
    //       clientId,
    //     );
    //   }
    //   if (dto.canvasState) {
    //     await this.storageService.removeFile(side.canvasStateUrl);
    //     side.canvasStateUrl = await this.storageService.uploadFile(
    //       Buffer.from(dto.canvasState),
    //       `${Date.now()}.json`,
    //       clientId,
    //     );
    //   }
    //   if (dto.templateSideId) {
    //     side.templateSide = await this.templateSideService.findOne(
    //       dto.templateSideId,
    //     );
    //   }
    //   if (dto.hasGraphics !== undefined) {
    //     side.hasGraphics = dto.hasGraphics;
    //   }
    //   if (dto.hasText !== undefined) {
    //     side.hasText = dto.hasText;
    //   }
    //   return this.repo.save(side);
  }
  async delete(id: string) {
    //   const side: DesignSide = await this.repo.findOneBy({ id });
    //   if (!side) {
    //     throw new NotFoundException('Design side not found');
    //   }
    //   // delete images from S3
    //   await this.storageService.removeFile(side.imageUrl);
    //   await this.storageService.removeFile(side.previewUrl);
    //   await this.storageService.removeFile(side.canvasStateUrl);
    //   return this.repo.remove(side);
  }
}
