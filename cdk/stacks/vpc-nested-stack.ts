import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

/**
 * Properties for a VpcNestedStack.
 */
export interface VpcNestedStackProps extends cdk.NestedStackProps {
  /**
   * Maximum AZs for the region.
   */
  maxAzs: number;
}

/**
 * Create a Virtual Private Cloud.
 * https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html
 */
export class VpcNestedStack extends cdk.NestedStack {
  /** Virtual Private Cloud instance. */
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props: VpcNestedStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: props.maxAzs });
  }
}
