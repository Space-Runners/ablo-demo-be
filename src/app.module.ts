import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GeneratorModule } from './generator/generator.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ClientModule } from './clients/client.module';
import { TemplateModule } from './template/template.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Image } from './generator/image.entity';
import { User } from './user/user.entity';
import databaseConfig from './typeorm.config';
import { DesignModule } from './design/design.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          ...databaseConfig,
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Image]),
    ScheduleModule.forRoot(),
    AuthModule,
    DesignModule,
    UserModule,
    GeneratorModule,
    ConfigurationModule,
    ClientModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
