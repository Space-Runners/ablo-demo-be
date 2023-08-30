import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
dotenv.config();

import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export default databaseConfig;
