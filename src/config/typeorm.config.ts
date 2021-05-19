import path from 'path';
import { ConnectionOptions } from 'typeorm';

/**
 * TypeORM configuration.
 */
export default {
  // Database connection
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

  entities: (process.env.NODE_ENV === 'production')
    ? [path.join(__dirname, '../../dist/modules/*/*.model.js')]
    : [path.join(__dirname, '../modules/*/*.model.ts')],
} as ConnectionOptions;
