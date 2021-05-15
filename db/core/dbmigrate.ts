const dbmigrate = require('db-migrate');

/**
 * Migrate DB to a target version.
 *
 * Can be upward or downward migration. If DB is already at the target version,
 * nothing will happen.
 *
 * @param [targetVersion] Targetted DB version. If targetVersion and process.env.EAR_DB_VERSION is
 *                        empty or not set, then all migration scripts will run.
 */
export async function dbMigrate(targetVersion?: string): Promise<void> {
  if (typeof targetVersion === 'undefined' && typeof process.env.EAR_DB_VERSION === 'undefined') {
    throw new Error('No DB version specified.');
  }

  const dbm = dbmigrate.getInstance(true, { env: 'default' });
  const version = targetVersion ?? process.env.EAR_DB_VERSION;
  if (version) {
    await dbm.sync(version);
  } else {
    await dbm.up();
  }
}
