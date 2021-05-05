#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import config from './config';
import { MainStack } from './stacks/main-stack';

const app = new cdk.App();

new MainStack(app, 'dev-api-usw2', {
  env: {
    account: config.env.dev.AWS_ACCOUNT_ID,
    region: 'us-west-2',
  },
});
