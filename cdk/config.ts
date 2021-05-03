/**
 * CDK Config.
 *
 * Mix of environment variables and configuration settings used for AWS CDK deployment.
 * Loads environment variables from other sibling directories (/api).
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Parse string into an integer (number) or throw error.
 * @param num a number to parse into integer
 * @throws Error when num is undefined or not an integer
 * @returns as a number
 */
function tryParseInt(num: string | undefined): number {
  if (num === undefined || !Number.isInteger(Number.parseInt(num))) {
    throw new Error(`Not an integer: ${num}`);
  }
  return Number.parseInt(num);
}

// Directories
const API_DIR = path.join(__dirname, '../api');

// Load environment variables into process.env
dotenv.config({ path: path.join(API_DIR, '.env') });

export default {
  // Used for API deployment
  API_DIR,
  API_PORT: tryParseInt(process.env.API_PORT),

  /**
   * Availibility Zones (AZs) for selected region, defaults to 3.
   * Minimum of 2 subnets in VPC in two different AZs for ApiStack to deploy successfully.
   * https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/RegionsAndAZs.html
   */
  AWS_REGION_AZ_COUNT: 2,
};
