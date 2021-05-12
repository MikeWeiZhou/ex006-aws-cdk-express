import { dbMigrate } from './lib/dbmigrate';

/**
 * Run database migrations locally.
 */

// This script should only be triggered by npm run scripts.
// The third argument onwards would be extra variable passed in by user.
let targetVersion;
if (process.argv.length > 2) {
  [,, targetVersion] = process.argv;
}

dbMigrate(targetVersion);
