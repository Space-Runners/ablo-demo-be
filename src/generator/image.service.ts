import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { Repository } from 'typeorm';
import { Client } from '../clients/client.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly repo: Repository<Image>,
  ) {}

  async create(photo: Image): Promise<Image> {
    return await this.repo.save(photo);
  }

  async bulkCreate(photos: Image[]): Promise<Image[]> {
    return this.repo.save(photos);
  }

  async checkClientAuth(id: string, client: Client): Promise<Image> {
    const image = await this.repo.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!image) throw new NotFoundException('Photo not found');

    if (image.client.id !== client.id) {
      throw new UnauthorizedException(
        'You are not authorized to view this photo',
      );
    }

    return image;
  }

  async findOne(id: string): Promise<Image> {
    return await this.repo.findOneBy({ id });
  }

  async findAll(take: number, skip: number): Promise<any> {
    const [result, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    return {
      data: result,
      count: total,
    };
  }

  async findByUser(userId: string): Promise<Image[]> {
    return await this.repo.find({
      where: { userId },
    });
  }

  async delete(id: string) {
    await this.repo.delete({ id });
  }
}
