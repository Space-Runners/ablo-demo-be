import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DemoUserDto } from './demo-user.dto';
import { Equal, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';
import { ClientService } from '../clients/client.service';
import { HttpStatusCode } from 'axios';
import { RoleName } from '../auth/role-name.enum';
import { Role } from './role.entity';
import { DashboardUserDto } from './dashboard-user.dto';
import { ConfigService } from '@nestjs/config';
import { Client } from '../clients/client.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(User)
    private repo: Repository<User>,
    private clientService: ClientService,
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

  async createDashboardUser(
    newUserDto: DashboardUserDto,
    role?: Role,
  ): Promise<User> {
    const user = this.repo.create(newUserDto);
    user.password = await argon2.hash(newUserDto.password);
    if (newUserDto.socialId) user.verified = true;

    user.firstName = (newUserDto as DashboardUserDto).name.split(' ')[0];
    user.lastName = (newUserDto as DashboardUserDto).name.split(' ')[1];

    const domain = newUserDto.email.split('@')[1];
    const client = await this.clientService.findOne({
      where: { domain },
      relations: ['users'],
    });

    if (!client) {
      throw new HttpException('Client not found', HttpStatusCode.Unauthorized);
    }

    // If this is the first user associated with the client, make them an admin
    if (client.users.length === 0) {
      const adminRole = await this.roleRepo.findOne({
        where: { name: RoleName.Admin },
      });
      user.roles = [adminRole];
    }
    // Else make them user (or whatever role is passed in)
    else {
      const userRole =
        role ||
        (await this.roleRepo.findOne({
          where: { name: RoleName.User },
        }));

      user.roles = [userRole];
    }

    user.client = client;

    await this.repo.save(user);
    delete user.password;

    await this.sendVerificationEmail(
      user,
      this.configService.get('CLIENT_DASHBOARD_URL'),
    );

    return user;
  }

  async sendVerificationEmail(user: User, url: string) {
    const buff = new Buffer(user.email);
    const base64data = buff.toString('base64');
    const verifyEmailUrl = `${url}/verify-email?token=${base64data}`;

    await this.sendgridService.sendVerificationEmail(
      user.email,
      user.firstName,
      verifyEmailUrl,
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

  async findAllByClient(client: Client): Promise<User[]> {
    return this.repo.find({
      where: { client: Equal(client.id) },
      relations: ['roles', 'client'],
      order: { email: 'ASC' },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { email: Equal(email) },
      relations: ['roles', 'client'],
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
