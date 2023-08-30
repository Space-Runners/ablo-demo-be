import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { MailService } from '../mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { ClientService } from '../clients/client.service';
import { Client } from '../clients/client.entity';
import { ApiKey } from '../clients/api-key.entity';
import { Role } from './role.entity';
import { ResetToken } from './reset-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey, Client, ResetToken, Role, User]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [ClientService, UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
