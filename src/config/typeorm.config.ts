import path from 'path';
import { ConnectionOptions, DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { constants } from './constants';

/**
 * Make generated identifiers readable. Thanks TypeORM.
 */
class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    const baseName = (typeof tableOrName === 'string')
      ? tableOrName
      : tableOrName.name;
    const name = columnNames.reduce(
      (accumulatedName, column) => `${accumulatedName}_${column}`,
      `fk_${baseName}`,
    );

    if (name.length > constants.MAX_MYSQL_CONTSTRAINT_ID_LENGTH) {
      return super
        .foreignKeyName(tableOrName, columnNames, referencedTablePath, referencedColumnNames);
    }
    return name;
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    const baseName = (typeof tableOrName === 'string')
      ? tableOrName
      : tableOrName.name;
    const name = columnNames.reduce(
      (accumulatedName, column) => `${accumulatedName}_${column}`,
      `idx_${baseName}`,
    );

    if (name.length > constants.MAX_MYSQL_INDEX_ID_LENGTH) {
      return super.indexName(tableOrName, columnNames, where);
    }
    return name;
  }

  relationConstraintName(tableOrName: Table|string, columnNames: string[], where?: string): string {
    const baseName = (typeof tableOrName === 'string')
      ? tableOrName
      : tableOrName.name;
    const name = columnNames.reduce(
      (accumulatedName, column) => `${accumulatedName}_${column}`,
      `rel_${baseName}`,
    );

    if (name.length > constants.MAX_MYSQL_INDEX_ID_LENGTH) {
      return super.relationConstraintName(tableOrName, columnNames, where);
    }
    return name;
  }
}

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

  namingStrategy: new CustomNamingStrategy(),

  entities: (process.env.NODE_ENV === 'production')
    ? [path.join(__dirname, '../../dist/modules/*/*.model.js')]
    : [path.join(__dirname, '../modules/*/*.model.ts')],

  // set to true for printing all SQL queries to console
  logging: false,
};

/**
 * TypeORM CLI requires default export.
 */
export default typeormConfig;
