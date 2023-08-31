import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GeneratorModule } from './generator/generator.module';
import { TemplateModule } from './template/template.module';
import { ScheduleModule } from '@nestjs/schedule';
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
    TypeOrmModule.forFeature([User]),
    ScheduleModule.forRoot(),
    AuthModule,
    DesignModule,
    UserModule,
    GeneratorModule,
    TemplateModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
