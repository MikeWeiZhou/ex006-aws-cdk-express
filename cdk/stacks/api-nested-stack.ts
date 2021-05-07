import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import config from '../config';
import { DbNestedStack } from './db-nested-stack';
import { VpcNestedStack } from './vpc-nested-stack';

/**
 * Properties for ApiNestedStack.
 */
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
   * API container environment variables.
   */
  apiEnvironment: {
    /**
     * Database hostname.
     */
    EAR_DB_HOST: string;
    /**
     * Database port.
     */
    EAR_DB_PORT: string;
  };
  /**
   * API container secret environment variables.
   */
  apiSecrets: {
    /**
     * Name of database.
     */
    EAR_DB_NAME: ecs.Secret;
    /**
     * Username used to access database.
     */
    EAR_DB_USER: ecs.Secret;
    /**
     * Password for specified database user.
     */
    EAR_DB_PASSWORD: ecs.Secret;
  };
}

/**
 * Create an API server running on Fargate.
 * https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html
 */
export class ApiNestedStack extends cdk.NestedStack {
  /**
   * API Port is only used internally within the VPC.
   * Port exposed to the world wide web will be the default ports: 80(http) or 443(https).
   */
  private readonly API_PORT = 4000;

  /**
   * Application load balanced Fargate service instance.
   */
  public readonly api: ecsPatterns.ApplicationLoadBalancedFargateService;

  constructor(scope: cdk.Construct, id: string, props: ApiNestedStackProps) {
    super(scope, id, props);

    // Create Fargate service
    this.api = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ApiFargateService', {
      vpc: props.vpcNestedStack.vpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(config.API_DOCKERFILE_DIR),
        containerPort: this.API_PORT,
        environment: {
          EAR_API_PORT: this.API_PORT.toString(),
          ...props.apiEnvironment,
        },
        secrets: props.apiSecrets,
      },
    });

    // Allow Fargate service to access database
    this.api.service.connections.allowToDefaultPort(props.dbNestedStack.db);
  }
}
