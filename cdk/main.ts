#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MainStack } from './stacks/main-stack';

const app = new cdk.App();

new MainStack(app, 'dev-api-usw1', {
  env: {
    account: process.env.AWS_DEV_ACCOUNT_ID,
    region: 'us-west-1',
    nodeEnv: 'production',
    dbSchemaVersion: '',
    secret: 'dev/api/usw1',
    maxAzs: 2,
  },
});

new MainStack(app, 'dev-api-usw2', {
  env: {
    account: process.env.AWS_DEV_ACCOUNT_ID,
    region: 'us-west-2',
    nodeEnv: 'production',
    dbSchemaVersion: '',
    secret: 'dev/api/usw2',
    maxAzs: 2,
  },
});
