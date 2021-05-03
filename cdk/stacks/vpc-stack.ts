import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import config from '../config';

/**
 * Create a Virtual Private Cloud used by other stacks.
 * https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html
 */
export class VpcStack extends cdk.Stack {
  /** Virtual Private Cloud. */
  public vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: config.AWS_AZ_COUNT});
  }
}
