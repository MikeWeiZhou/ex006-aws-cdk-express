import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

/**
 * Custom stack props extending cdk.StackProps to include VPC.
 */
export interface CustomStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}
