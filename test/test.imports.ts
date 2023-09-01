import { TypeOrmModule } from '@nestjs/typeorm';
import { testingConfig } from './typeorm.config.test';
import { User } from '../src/user/user.entity';
import { AuthModule } from '../src/auth/auth.module';
import { Role } from '../src/user/role.entity';
import { Design } from '../src/design/design.entity';
import { ConfigModule } from '@nestjs/config';
import { DesignModule } from '../src/design/design.module';
import { UserModule } from '../src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from '../src/mail/mail.module';

export const imports = [
  ConfigModule.forRoot(),
  TypeOrmModule.forRoot(testingConfig),
  TypeOrmModule.forFeature([Role, User, Design]),
  ScheduleModule.forRoot(),
  AuthModule,
  DesignModule,
  MailModule,
  UserModule,
];
