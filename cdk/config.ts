import * as path from 'path';

/**
 * CDK deployment configuration settings.
 */
export default {
  /**
   * Absolute path to API Dockerfile directory.
   */
  API_DOCKERFILE_DIR: path.join(__dirname, '../'),
  /**
   * Absolute path to database migration Dockerfile directory.
   */
  DB_MIGRATION_DOCKERFILE_DIR: path.join(__dirname, '../db'),
};
