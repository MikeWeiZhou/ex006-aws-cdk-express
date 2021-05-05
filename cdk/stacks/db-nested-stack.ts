import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import { VpcNestedStack } from './vpc-nested-stack';

/**
 * Create an Aurora Serverless DB cluster.
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html
 */
export class DbNestedStack extends cdk.NestedStack {
  /**
   * Aurora Serverless DB Cluster instance.
   */
  public readonly db: rds.ServerlessCluster;

  constructor(scope: cdk.Construct, id: string, props: DbNestedStackProps) {
    super(scope, id, props);

    this.db = new rds.ServerlessCluster(this, 'ServerlessDbCluster', {
      vpc: props.vpcNestedStack.vpc,
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_5_7_12 }),
      credentials: rds.Credentials.fromPassword(props.adminUserName, props.adminPassword),
      defaultDatabaseName: props.defaultDatabaseName,
      enableDataApi: true,
    });
  }
}

export interface DbNestedStackProps extends cdk.NestedStackProps {
  /**
   * An instance of `VpCNestedStack`.
   */
  vpcNestedStack: VpcNestedStack;
  /**
   * Name of the database to be automatically created.
   */
  defaultDatabaseName: string;
  /**
   * Set administrator's username.
   */
  adminUserName: string;
  /**
   * Set administrator's password.
   */
  adminPassword: cdk.SecretValue;
}
