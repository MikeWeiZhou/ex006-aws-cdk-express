import * as path from 'path';

type AwsEnvironment = 'dev';
type EnvironmentSpecificSettings = {
  [key in AwsEnvironment]: {
    /**
     * AWS account ID for the environment.
     */
    AWS_ACCOUNT_ID: string,
  };
}

/**
 * Environment specific settings.
 */
const environmentSpecificSettings: EnvironmentSpecificSettings = {
  dev: {
    AWS_ACCOUNT_ID: "743667830804",
  },
};

/**
 * CDK configuration settings.
 */
export default {
  /**
   * Absolute path to API Dockerfile directory.
   */
  API_DOCKERFILE_DIR: path.join(__dirname, '../api'),
  /**
   * Max Availibility Zones (AZs) for selected region, defaults to 3.
   * Minimum of two AZs required for successful deployment.
   * https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/RegionsAndAZs.html
   */
  AWS_MAX_AZ_COUNT: 2,
  /**
  * Environment specific settings.
  */
 env: environmentSpecificSettings,
};
