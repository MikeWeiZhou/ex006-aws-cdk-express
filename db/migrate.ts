import { dbMigrate } from './lib/dbmigrate';

/**
 * Run database migrations locally.
 */

// This script should only be triggered by npm run scripts.
// The third argument would be extra variable passed in by user.
if (process.argv.length > 2) {
  const targetVersion = process.argv[2];
  dbMigrate(targetVersion);
} else {
  dbMigrate();
}
