#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import config from './config';
import { VpcStack } from './stacks/vpc-stack';
import { DbStack } from './stacks/db-stack';
import { ApiStack } from './stacks/api-stack';

const app = new cdk.App();

// ----------------------------------------
// Dev Environment in `us-west-2` region
// ----------------------------------------
const devVpcUsw2 = new VpcStack(app, 'dev-vpc-usw2', {
  env: {
    account: config.env.dev.AWS_ACCOUNT_ID,
    region: 'us-west-2',
  },
});
const devDbUsw2 = new DbStack(app, 'dev-db-usw2', {
  vpc: devVpcUsw2.vpc,
  env: {
    account: config.env.dev.AWS_ACCOUNT_ID,
    region: 'us-west-2',
  },
});
new ApiStack(app, 'dev-api-usw2', {
  vpc: devVpcUsw2.vpc,
  db: devDbUsw2.db,
  env: {
    account: config.env.dev.AWS_ACCOUNT_ID,
    region: 'us-west-2',
  },
});
