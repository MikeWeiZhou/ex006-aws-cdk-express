import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { dbMigrate } from './lib/dbmigrate';

/**
 * This Lambda function is called during CDK deployments/destructions to run database migration
 * scripts.
 *
 * Called when:
 *  - Creating a stack
 *  - Updating a stack
 *  - Deleting a stack
 *
 * @param event contains .RequestType = Create | Update | Delete
 */
export const runMigration: CloudFormationCustomResourceHandler = async (event) => {
  switch (event.RequestType) {
    case 'Create':
      await dbMigrate();
      break;
    case 'Update':
      await dbMigrate();
      break;
    case 'Delete':
      break;
    default:
      throw new Error('Unexpected event.RequestType');
  }
};
