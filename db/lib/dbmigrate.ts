const dbmigrate = require('db-migrate');

/**
 * Migrate DB to a target version.
 *
 * Can be upward or downward migration. If DB is already at the target version,
 * nothing will happen.
 *
 * @param [targetVersion] targetted DB version; defaults to process.env.EAR_DB_VERSION
 */
export async function dbMigrate(targetVersion?: string): Promise<void> {
  if (typeof targetVersion === 'undefined' && typeof process.env.EAR_DB_VERSION === 'undefined') {
    throw new Error('No DB version specified.');
  }

  const dbm = dbmigrate.getInstance(true, { env: 'default' });
  await dbm.sync(targetVersion ?? process.env.EAR_DB_VERSION);
}
