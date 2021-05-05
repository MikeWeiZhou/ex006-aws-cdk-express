import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import config from '../config';
import { DbNestedStack } from './db-nested-stack';
import { VpcNestedStack } from './vpc-nested-stack';

const ENV = [
  'EAR_API_PORT',
  'EAR_DB_HOST',
  'EAR_DB_PORT',
  'EAR_DB_NAME',
  'EAR_DB_USER',
];
const ENV_SECRET = [
  'EAR_DB_PASSWORD',
];

/**
 * Create a Fargate service running the API server from a Dockerfile.
 * https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html
 */
export class ApiNestedStack extends cdk.NestedStack {
  /**
   * Application load balanced Fargate service instance.
   */
  public readonly api: ecsPatterns.ApplicationLoadBalancedFargateService;

  constructor(scope: cdk.Construct, id: string, props: ApiNestedStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'ApiCluster', {
      vpc: props.vpcNestedStack.vpc,
    });

    this.api = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ApiFargateService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(config.API_DOCKERFILE_DIR),
        containerPort: props.apiPort,
        environment: props.apiEnvironment,
        secrets: props.apiSecrets,
      },
    });

    // Allow API to access DB
    this.api.service.connections.allowToDefaultPort(props.dbNestedStack.db);
  }
}

export interface ApiNestedStackProps extends cdk.NestedStackProps {
  /**
   * An instance of `VpcNestedStack`.
   */
  vpcNestedStack: VpcNestedStack;
  /**
   * An instance of `DbNestedStack`.
   */
  dbNestedStack: DbNestedStack;
  /**
   * API container port.
   */
  apiPort: number;
  /**
   * API container environment variables.
   */
  apiEnvironment: { [key: string]: string };
  /**
   * API container secret environment variables.
   */
  apiSecrets: { [key: string]: ecs.Secret };
}
