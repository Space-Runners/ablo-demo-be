import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { MailService } from '../mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { Role } from './role.entity';
import { ResetToken } from './reset-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetToken, Role, User]), ConfigModule],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
