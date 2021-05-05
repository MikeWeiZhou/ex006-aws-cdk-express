import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import parameterStore from '../lib/parameter-store';
import { StackPropsWithVpc } from './vpc-stack';

const ENV = [
  'EAR_DB_PORT',
  'EAR_DB_NAME',
  'EAR_DB_USER',
];
const ENV_SECURE = {
  'EAR_DB_PASSWORD': 1,
};

/**
 * Create an Aurora Serverless DB cluster.
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html
 */
export class DbStack extends cdk.Stack {
  public readonly db: rds.ServerlessCluster;

  constructor(scope: cdk.Construct, id: string, props: StackPropsWithVpc) {
    super(scope, id, props);

    const env = parameterStore.getStrings(this, ENV);
    const envSecure = parameterStore.getSecureStrings(this, ENV_SECURE);

    this.db = new rds.ServerlessCluster(this, 'DbServerlessCluster', {
      vpc: props.vpc,
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_5_7_12 }),
      credentials: rds.Credentials.fromPassword(
        env.EAR_DB_USER,
        new cdk.SecretValue(envSecure.EAR_DB_PASSWORD),
      ),
      defaultDatabaseName: env.EAR_DB_NAME,
      enableDataApi: true,
    });
  }
}

/**
 * Stack props with DB Cluster `rds.ServerlessCluster` object.
 */
export interface StackPropsWithDb extends StackPropsWithVpc {
  db: rds.ServerlessCluster;
}
