import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';
import { Equal, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';
import { RoleName } from '../auth/role-name.enum';
import { Role } from './role.entity';
import { ConfigService } from '@nestjs/config';
import { HttpStatusCode } from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(User)
    private repo: Repository<User>,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async create(newUserDto: UserDto, role?: Role): Promise<User> {
    // Check if user already exists
    const existingUser = await this.repo.findOne({
      where: { email: Equal(newUserDto.email) },
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatusCode.Conflict);
    }

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

  static getVerifyToken(email: string): string {
    const buff = Buffer.from(email);
    const token = buff.toString('base64');

    return token;
  }

  static createVerifyEmailUrl(email: string, url: string): string {
    const token = UserService.getVerifyToken(email);
    const verifyEmailUrl = `${url}/verify-email?token=${token}`;

    return verifyEmailUrl;
  }

  async sendVerificationEmail(user: User, url: string) {
    await this.mailService.sendVerificationEmail(
      user.email,
      user.firstName,
      UserService.createVerifyEmailUrl(user.email, url),
    );
  }

  async verifyEmail(token: string): Promise<User> {
    console.log('verifyEmail', token);
    const buff = Buffer.from(token, 'base64');
    const decodeText = buff.toString('ascii');

    const user = await this.repo.findOne({
      where: { email: decodeText },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.verified = true;
    await this.repo.save(user);

    await this.mailService.sendWelcomeEmail(user.email, user.firstName);
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
