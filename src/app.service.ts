import { Injectable } from '@nestjs/common';
import { Image } from './generator/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from './user/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Image)
    private readonly photoRepository: Repository<Image>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Write a CRON job that checks for ALL temporary photos created in previous 48h and if there is no registered user for that photo, delete it.
  @Cron('0 0 * * * *', {
    name: 'deleteTemporaryPhotos',
    timeZone: 'Europe/Paris',
  })
  async deleteTemporaryPhotos() {
    const photos = await this.photoRepository.find({
      where: {
        createdAt: LessThan(new Date(Date.now() - 48 * 60 * 60 * 1000)),
        temporary: true,
      },
    });

    const photoIds = [];
    for (const photo of photos) {
      const user = await this.userRepository.findOneBy({ id: photo.userId });
      if (!user) {
        photoIds.push(photo.id);
      }
    }

    await this.photoRepository.delete(photoIds);
  }
}
