import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { TypeormNamingStrategy } from './typeorm/typeorm-naming-strategy';

/**
 * TypeORM configuration.
 */
export const typeormConfig: ConnectionOptions = {
  // database connection
  type: 'mysql',
  host: process.env.EAR_DB_HOST,
  port: Number.parseInt(process.env.EAR_DB_PORT!, 10),
  database: process.env.EAR_DB_NAME,
  username: process.env.EAR_DB_USER,
  password: process.env.EAR_DB_PASSWORD,
  charset: 'utf8mb4_unicode_ci',
  extra: {
    connectionLimit: 5,
  },

  namingStrategy: new TypeormNamingStrategy(),

  entities: (process.env.NODE_ENV === 'production')
    ? [path.join(__dirname, '../../dist/modules/*/*-entity.js')]
    : [path.join(__dirname, '../modules/*/*-entity.ts')],

  // set to true for printing all SQL queries to console
  logging: false,
};

/**
 * TypeORM CLI requires default export.
 */
export default typeormConfig;
