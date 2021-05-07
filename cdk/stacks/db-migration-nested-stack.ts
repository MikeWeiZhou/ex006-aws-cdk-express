import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as lambda from '@aws-cdk/aws-lambda';
import config from '../config';
import { VpcNestedStack } from './vpc-nested-stack';
import { DbNestedStack } from './db-nested-stack';

/**
 * Properties for a DbMigrationNestedStack.
 */
export interface DbMigrationNestedStackProps extends cdk.NestedStackProps {
  /**
   * An instance of VpCNestedStack.
   */
  vpcNestedStack: VpcNestedStack;
  /**
   * An instance of DbNestedStack.
   */
  dbNestedStack: DbNestedStack;
  /**
   * Target version of database schema. e.g. "20210503101932-init"
   */
  dbSchemaVersion: string;
  /**
   * Name of the database to run migrations scripts on.
   */
  dbName: cdk.SecretValue;
  /**
   * Name of user that has privilege to run migration scripts.
   */
  dbUser: cdk.SecretValue;
  /**
   * Password for specified user.
   */
  dbPassword: cdk.SecretValue;
  /**
   * The execution time after which Lambda terminates the database migration process and
   * result in a failed CDK deployment.
   *
   * @default 5 minutes
   */
  timeout?: cdk.Duration;
}

/**
 * Runs database migration scripts using a Lambda-backed CustomResource.
 *
 * TODO: do not use Lambda to migrate, has max timeout of 15 minutes
 */
export class DbMigrationNestedStack extends cdk.NestedStack {
  /**
   * The default execution time after which Lambda terminates the database migration process and
   * result in a failed CDK deployment.
   */
  private readonly DEFAULT_TIMEOUT = cdk.Duration.minutes(5);

  constructor(scope: cdk.Construct, id: string, props: DbMigrationNestedStackProps) {
    super(scope, id, props);

    // Create Lambda function to run database migrations
    const dbMigrationLambda = new lambda.DockerImageFunction(this, 'DbMigrationLambda', {
      vpc: props.vpcNestedStack.vpc,
      code: lambda.DockerImageCode.fromImageAsset(config.DB_MIGRATION_DOCKERFILE_DIR),
      timeout: props.timeout ?? this.DEFAULT_TIMEOUT,
      environment: {
        EAR_DB_VERSION: props.dbSchemaVersion,
        EAR_DB_HOST: props.dbNestedStack.db.clusterEndpoint.hostname.toString(),
        EAR_DB_PORT: cdk.Token.asString(props.dbNestedStack.db.clusterEndpoint.port),
        EAR_DB_NAME: props.dbName.toString(),
        EAR_DB_USER: props.dbUser.toString(),
        EAR_DB_PASSWORD: props.dbPassword.toString(),
      },
    });

    // Allow Lambda function to connect to database
    dbMigrationLambda.connections.allowToDefaultPort(props.dbNestedStack.db);

    // Execute Lambda function by creating custom resource and provider
    const dbMigrationProvider = new cr.Provider(this, 'DbMigrationProvider', {
      vpc: props.vpcNestedStack.vpc,
      onEventHandler: dbMigrationLambda,
    });
    new cdk.CustomResource(this, 'DbMigrationCustomResource', {
      serviceToken: dbMigrationProvider.serviceToken,
      properties: {
        // This property has no use other than signal CDK that there are changes,
        // therefore allowing database migration scripts to run when 'version' changes.
        version: props.dbSchemaVersion,
      },
    });
  }
}
