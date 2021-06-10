import path from 'path';
import { readdir } from 'fs';

const dbmigrate = require('db-migrate');

/**
 * Absolute path to migration files.
 */
const MIGRATIONS_DIRECTORY = path.join(__dirname, '../migrations');

/**
 * Returns latest database schema version name.
 * @returns latest db schema version name
 */
export async function latestDbSchemaVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    readdir(MIGRATIONS_DIRECTORY, (error, files) => {
      if (error) {
        return reject(error);
      }

      const matchRegex = /([0-9]+)-([\w-]+)/;

      let latestVersionTime = 0;
      let latestVersionName = '';
      files.forEach((file) => {
        const match = matchRegex.exec(file);
        if (match && Number.parseInt(match[1], 10) > latestVersionTime) {
          const [name, time] = match;
          latestVersionTime = Number.parseInt(time, 10);
          latestVersionName = name;
        }
      });

      if (latestVersionName === '') {
        return reject(new Error('Cannot find latest database schema version.'));
      }

      return resolve(latestVersionName);
    });
  });
}

/**
 * Migrate DB to a target version.
 *
 * Can be upward or downward migration. If DB is already at the target version,
 * nothing will happen.
 *
 * @param targetVersion Targetted DB version. If targetVersion and process.env.EAR_DB_VERSION is
 *                        empty or not set, then all migration scripts will run.
 */
export async function dbMigrate(targetVersion?: string): Promise<void> {
  const dbm = dbmigrate.getInstance(true, { env: 'default' });
  const version = targetVersion
    || process.env.EAR_DB_VERSION
    || await latestDbSchemaVersion();
  await dbm.sync(version);
}
