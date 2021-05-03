import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import config from '../config';
import { CustomStackProps } from './custom-stack-props.interface';

/**
 * Stack definition for creating a Fargate service running the API server.
 *
 * https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html
 */
export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'ApiCluster', { vpc: props.vpc });
    new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ApiFargateService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(config.API_DIR),
        containerPort: config.API_PORT,
      },
    });
  }
}
