import { dbMigrate } from './core/dbmigrate';

/**
 * Run database migrations locally.
 */

// This script should only be triggered by npm run scripts.
// The third argument onwards would be extra variable passed in by user.
const targetVersion = process.argv[2];
dbMigrate(targetVersion);
