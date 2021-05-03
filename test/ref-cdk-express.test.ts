import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as RefCdkExpress from '../lib/ref-cdk-express-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new RefCdkExpress.RefCdkExpressStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
