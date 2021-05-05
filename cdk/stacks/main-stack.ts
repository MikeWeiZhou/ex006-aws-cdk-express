import * as cdk from '@aws-cdk/core';
import parameterStore from '../lib/parameter-store';
import { VpcNestedStack } from './vpc-nested-stack';
import { DbNestedStack } from './db-nested-stack';
import { ApiNestedStack } from './api-nested-stack';

/**
 * Creates a new API server with all necessary resources.
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html
 */
export class MainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Retrieve variables from Parameter Store
    const env = parameterStore.getStrings(this, [
      'EAR_API_PORT',
      'EAR_DB_PORT',
      'EAR_DB_NAME',
      'EAR_DB_USER',
    ]);
    const secureEnv = parameterStore.getSecureStrings(this, {
      'EAR_DB_PASSWORD': 1,
    });
    const secretEnv = parameterStore.getSecrets(this, [
      'EAR_DB_PASSWORD',
    ]);

    // Create VpcNestedStack
    const vpcNestedStack = new VpcNestedStack(this, 'VpcNestedStack');

    // Create DbNestedStack
    const dbNestedStack = new DbNestedStack(this, 'DbNestedStack', {
      vpcNestedStack,
      defaultDatabaseName: env['EAR_DB_NAME'],
      adminUserName: env['EAR_DB_USER'],
      adminPassword: new cdk.SecretValue(secureEnv['EAR_DB_PASSWORD']),
    });

    // Create ApiNestedStack
    const apiNestedStack = new ApiNestedStack(this, 'ApiNestedStack', {
      vpcNestedStack,
      dbNestedStack,
      apiPort: Number.parseInt(env['EAR_API_PORT']),
      apiEnvironment: {
        'EAR_API_PORT': env['EAR_API_PORT'],
        'EAR_DB_HOST': dbNestedStack.db.clusterEndpoint.hostname.toString(),
        'EAR_DB_PORT': env['EAR_DB_PORT'],
        'EAR_DB_NAME': env['EAR_DB_NAME'],
        'EAR_DB_USER': env['EAR_DB_USER'],
      },
      apiSecrets: {
        'EAR_DB_PASSWORD': secretEnv['EAR_DB_PASSWORD'],
      },
    });
  }
}
