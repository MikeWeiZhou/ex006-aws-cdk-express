import * as cdk from '@aws-cdk/core';
import * as sm from '@aws-cdk/aws-secretsmanager';
import * as ecs from '@aws-cdk/aws-ecs';
import { VpcNestedStack } from './vpc-nested-stack';
import { DbNestedStack } from './db-nested-stack';
import { DbMigrationNestedStack } from './db-migration-nested-stack';
import { ApiNestedStack } from './api-nested-stack';

/**
 * Deployment environment for the `MainStack`.
 */
export interface MainEnvironment extends cdk.Environment {
  /**
   * The target database schema version.
   *
   * Database versions follows this format: "{TIMESTAMP}-{NAME}".
   * For example, it could be "20210503101932-init"
   */
  readonly dbSchemaVersion: string;
  /**
   * Name of the secret (AWS Secrets Manager) containing key-value pairs as environment variables.
   */
  readonly secret: string;
  /**
   * Maximum number of Availability Zones (AZs) in the region.
   */
  readonly maxAzs: number;
}

/**
 * Properties for a MainStack.
 */
export interface MainStackProps extends cdk.StackProps {
  /**
   * Environment settings for stack.
   */
  env: MainEnvironment;
}

/**
 * Creates a new API server with all necessary resources.
 *
 * Will create and run these services in order:
 *  1. Virtual Private Cloud (VPC) - every other services will run inside this VPC
 *  2. Aurora Serverless database cluster
 *  3. Run database migrations - by creating Lambda function and custom resources
 *  4. Creates API server running on Fargate
 */
export class MainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: MainStackProps) {
    super(scope, id, props);

    // Retrieve values from secret (can be used as strings easily)
    const secret = sm.Secret.fromSecretNameV2(this, 'Secret', props.env.secret);
    const dbName = secret.secretValueFromJson('EAR_DB_NAME');
    const dbUser = secret.secretValueFromJson('EAR_DB_USER');
    const dbPassword = secret.secretValueFromJson('EAR_DB_PASSWORD');
    // Retrieve values as secret environment variables (cannot convert above values)
    const dbNameSecret = ecs.Secret.fromSecretsManager(secret, 'EAR_DB_NAME');
    const dbUserSecret = ecs.Secret.fromSecretsManager(secret, 'EAR_DB_USER');
    const dbPasswordSecret = ecs.Secret.fromSecretsManager(secret, 'EAR_DB_PASSWORD');

    // Create VPC
    const vpcNestedStack = new VpcNestedStack(this, 'VpcNestedStack', {
      maxAzs: props.env.maxAzs,
    });

    // Create database
    const dbNestedStack = new DbNestedStack(this, 'DbNestedStack', {
      vpcNestedStack,
      defaultDatabaseName: dbName,
      adminUser: dbUser,
      adminPassword: dbPassword,
    });

    // Run database migrations
    new DbMigrationNestedStack(this, 'DbMigrationNestedStack', {
      vpcNestedStack,
      dbNestedStack,
      dbSchemaVersion: props.env.dbSchemaVersion,
      dbName,
      dbUser,
      dbPassword,
    });

    // Create API server
    new ApiNestedStack(this, 'ApiNestedStack', {
      vpcNestedStack,
      dbNestedStack,
      apiEnvironment: {
        EAR_DB_HOST: dbNestedStack.db.clusterEndpoint.hostname.toString(),
        EAR_DB_PORT: cdk.Token.asString(dbNestedStack.db.clusterEndpoint.port),
      },
      apiSecrets: {
        EAR_DB_NAME: dbNameSecret,
        EAR_DB_USER: dbUserSecret,
        EAR_DB_PASSWORD: dbPasswordSecret,
      },
    });
  }
}
