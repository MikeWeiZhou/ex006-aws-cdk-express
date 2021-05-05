import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import config from '../config';
import parameterStore from '../lib/parameter-store';
import { StackPropsWithDb } from './db-stack';

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
export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StackPropsWithDb) {
    super(scope, id, props);

    const environment = parameterStore.getStrings(this, ENV);
    const secrets = parameterStore.getSecrets(this, ENV_SECRET);
    const cluster = new ecs.Cluster(this, 'ApiCluster', { vpc: props.vpc });

    const api = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ApiFargateService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(config.API_DOCKERFILE_DIR),
        containerPort: Number.parseInt(environment.EAR_API_PORT),
        environment,
        secrets,
      },
    });

    // Allow API to access DB
    api.service.connections.allowToDefaultPort(props.db);
  }
}
