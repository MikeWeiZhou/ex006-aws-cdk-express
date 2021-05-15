import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import { VpcNestedStack } from './vpc-nested-stack';

/**
 * Properties for a DbNestedStack.
 */
export interface DbNestedStackProps extends cdk.NestedStackProps {
  /**
   * An instance of `VpCNestedStack`.
   */
  vpcNestedStack: VpcNestedStack;
  /**
   * Name of the database to be automatically created.
   */
  defaultDatabaseName: cdk.SecretValue;
  /**
   * Set administrator's username.
   */
  adminUser: cdk.SecretValue;
  /**
   * Set administrator's password.
   */
  adminPassword: cdk.SecretValue;
}

/**
 * Create an Aurora Serverless database cluster.
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html
 *
 * TODO: use custom resource to create a regular user, should not use admin user
 */
export class DbNestedStack extends cdk.NestedStack {
  /**
   * Aurora Serverless DB Cluster instance.
   */
  public readonly db: rds.ServerlessCluster;

  /**
   * Default MySQL 5.7 character set is latin1, but utf8 is recommended by MySQL themself.
   *
   * https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/docker-mysql-more-topics.html
   * https://stackoverflow.com/questions/2708958/differences-between-utf8-and-latin1
   * https://stackoverflow.com/questions/30074492/what-is-the-difference-between-utf8mb4-and-utf8-charsets-in-mysql
   */
  private readonly characterSet: string = 'utf8mb4';

  /**
   * Default MySQL 5.7 collation is latin1, but utf8 is recommended by MySQL themself.
   */
  private readonly collationServer: string = 'utf8mb4_unicode_ci';

  constructor(scope: cdk.Construct, id: string, props: DbNestedStackProps) {
    super(scope, id, props);

    // Database engine to use
    const engine = rds.DatabaseClusterEngine.auroraMysql({
      version: rds.AuroraMysqlEngineVersion.VER_5_7_12,
    });

    // Parameters sent to database cluster and instances
    // https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Reference.html#AuroraMySQL.Reference.ParameterGroups
    const parameterGroup = new rds.ParameterGroup(this, 'DbParameterGroup', {
      engine,
      parameters: {
        character_set_server: this.characterSet,
        collation_server: this.collationServer,
      },
    });

    // Create new database cluster
    this.db = new rds.ServerlessCluster(this, 'ServerlessDbCluster', {
      vpc: props.vpcNestedStack.vpc,
      engine,
      parameterGroup,
      credentials: rds.Credentials.fromPassword(
        props.adminUser.toString(),
        props.adminPassword,
      ),
      defaultDatabaseName: props.defaultDatabaseName.toString(),
      enableDataApi: true,
    });
  }
}
