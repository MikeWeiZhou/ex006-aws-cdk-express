#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from './stacks/vpc-stack';
import { ApiStack } from './stacks/api-stack';

const app = new cdk.App();

const vpcStack = new VpcStack(app, 'VpcStack', {});

new ApiStack(app, 'ApiStack', { vpc: vpcStack.vpc });
