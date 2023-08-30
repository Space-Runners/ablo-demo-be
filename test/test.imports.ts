import { TypeOrmModule } from '@nestjs/typeorm';
import { testingConfig } from './typeorm.config.test';
import { Image } from '../src/generator/image.entity';
import { User } from '../src/user/user.entity';
import { Client } from '../src/clients/client.entity';
import { ApiKey } from '../src/clients/api-key.entity';
import { AuthModule } from '../src/auth/auth.module';
import { Role } from '../src/user/role.entity';
import { Template } from '../src/template/template.entity';
import { Design } from '../src/design/design.entity';
import { ConfigModule } from '@nestjs/config';
import { DesignModule } from '../src/design/design.module';
import { UserModule } from '../src/user/user.module';
import { GeneratorModule } from '../src/generator/generator.module';
import { ConfigurationModule } from '../src/configuration/configuration.module';
import { ClientModule } from '../src/clients/client.module';
import { TemplateModule } from '../src/template/template.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from '../src/mail/mail.module';

export const imports = [
  ConfigModule.forRoot(),
  TypeOrmModule.forRoot(testingConfig),
  TypeOrmModule.forFeature([
    ApiKey,
    Client,
    Image,
    Role,
    Template,
    User,
    Design,
  ]),
  ScheduleModule.forRoot(),
  AuthModule,
  DesignModule,
  MailModule,
  UserModule,
  GeneratorModule,
  ConfigurationModule,
  ClientModule,
  TemplateModule,
];
