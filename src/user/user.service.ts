import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DemoUserDto } from './demo-user.dto';
import { Equal, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';
import { RoleName } from '../auth/role-name.enum';
import { Role } from './role.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(User)
    private repo: Repository<User>,
    private configService: ConfigService,
    private sendgridService: MailService,
  ) {}

  async createDemoUser(newUserDto: DemoUserDto, role?: Role): Promise<User> {
    const user = this.repo.create(newUserDto);
    user.password = await argon2.hash(newUserDto.password);
    if (newUserDto.socialId) user.verified = true;

    const userRole =
      role ||
      (await this.roleRepo.findOne({
        where: { name: RoleName.User },
      }));

    user.roles = [userRole];

    await this.repo.save(user);
    delete user.password;

    await this.sendVerificationEmail(user, this.configService.get('DEMO_URL'));

    return user;
  }

  static createVerifyEmailUrl(email: string, url: string): string {
    const buff = new Buffer(email);
    const base64data = buff.toString('base64');
    const verifyEmailUrl = `${url}/verify-email?token=${base64data}`;

    return verifyEmailUrl;
  }

  async sendVerificationEmail(user: User, url: string) {
    await this.sendgridService.sendVerificationEmail(
      user.email,
      user.firstName,
      UserService.createVerifyEmailUrl(user.email, url),
    );
  }

  async verifyEmail(token: string): Promise<User> {
    const buff = new Buffer(token, 'base64');
    const decodeText = buff.toString('ascii');

    const user = await this.repo.findOne({
      where: { email: decodeText },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.verified = true;
    await this.repo.save(user);

    await this.sendgridService.sendWelcomeEmail(user.email, user.firstName);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { email: Equal(email) },
      relations: ['roles'],
    });

    return user;
  }

  findOne(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
