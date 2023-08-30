import { DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

import 'reflect-metadata';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const testingConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL_TEST,
  synchronize: true,
  dropSchema: true,
  entities: [process.cwd() + '/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*.js'],
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
};
