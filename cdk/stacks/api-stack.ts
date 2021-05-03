import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ssm from '@aws-cdk/aws-ssm';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import config from '../config';
import { CustomStackProps } from './custom-stack-props.interface';

/**
 * Create a Fargate service running the API server from a Dockerfile.
 *
 * https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html
 */
export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const apiPort = ssm.StringParameter.valueFromLookup(this, 'EAR_API_PORT');
    const cluster = new ecs.Cluster(this, 'ApiCluster', { vpc: props.vpc });
    new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ApiFargateService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(config.API_DOCKERFILE_DIR),
        containerPort: Number.parseInt(apiPort),
        environment: {
          EAR_API_PORT: apiPort,
        },
      },
    });
  }
}
