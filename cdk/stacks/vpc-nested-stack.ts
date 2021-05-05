import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import config from '../config';

/**
 * Create a Virtual Private Cloud used by other stacks.
 * https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html
 */
export class VpcNestedStack extends cdk.NestedStack {
  /** Virtual Private Cloud instance. */
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: config.AWS_MAX_AZ_COUNT});
  }
}
