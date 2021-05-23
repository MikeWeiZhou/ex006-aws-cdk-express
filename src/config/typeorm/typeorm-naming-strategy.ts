import { DefaultNamingStrategy, Table } from 'typeorm';
import { constants } from '../constants';

/**
 * Make generated database identifiers readable.
 */
export class TypeormNamingStrategy extends DefaultNamingStrategy {
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
