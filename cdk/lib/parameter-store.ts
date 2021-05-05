import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ssm from '@aws-cdk/aws-ssm';

/**
 * Key-value pairs with the value being a token that is eventually resolved into a string.
 */
export interface Parameters {
  [parameterName: string]: string;
}

/**
 * Key-value pairs with value being `ecs.Secret` type.
 */
export interface ParameterSecrets {
  [parameterName: string]: ecs.Secret;
}

/**
 * Key-value pairs with value being parameter version number.
 */
export interface ParameterVersions {
  [parameterName: string]: number;
}

/**
 * AWS Parameter Store.
 */
export class ParameterStore {
  /**
   * Returns `String` typed parameter from AWS Parameter Store.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterName name of parameter to retrieve
   * @returns parameter value
   */
  getString(scope: cdk.Construct, parameterName: string): string {
    return ssm.StringParameter.valueFromLookup(scope, parameterName);
  }

  /**
   * Returns `String` typed parameters from AWS Parameter Store.
   * Parameter values are tokens that resolve during cdk synth.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterNames names of parameters to retrieve
   * @returns parameter names and values
   */
  getStrings(scope: cdk.Construct, parameterNames: string[]): Parameters {
    const results: { [parameterName: string]: string } = {};
    parameterNames.forEach((parameterName) => {
      results[parameterName] = this.getString(scope, parameterName);
    });
    return results;
  }

  /**
   * Returns `SecureString` tyep parameter from AWS Parameter Store.
   * Parameter value is a token that resolve during cdk deploy.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterName name of parameter to retrieve
   * @param parameterVersion parameter version (required for `SecureString`)
   * @returns parameter value
   */
  getSecureString(
    scope: cdk.Construct,
    parameterName: string,
    parameterVersion: number,
  ): string {
    return ssm.StringParameter
      .valueForSecureStringParameter(scope, parameterName, parameterVersion);
  }

  /**
   * Returns `SecureString` typed parameters from AWS Parameter Store.
   * Parameter values are tokens that resolve during cdk deploy.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterVersions an object with key=parameterName and value=parameterVersion
   * @returns parameter names and values
   */
  getSecureStrings(scope: cdk.Construct, parameterVersions: ParameterVersions): Parameters {
    const results: { [parameterName: string]: string } = {};
    Object.entries(parameterVersions).forEach((entry) => {
      const [parameterName, parameterVersion] = entry;
      results[parameterName] = this.getSecureString(scope, parameterName, parameterVersion);
    });
    return results;
  }

  /**
   * Returns `SecureString` typed parameters from AWS Parameter Store wrapped as secret environment
   * variables.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterName name of parameter to retrieve
   * @returns parameter value as secret
   */
  getSecret(scope: cdk.Construct, parameterName: string): ecs.Secret {
    return ecs.Secret.fromSsmParameter(
      ssm.StringParameter.fromStringParameterName(scope, parameterName, parameterName),
    );
  }

  /**
   * Returns `SecureString` typed parameters from AWS Parameter Store wrapped as secret environment
   * variables.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterNames names of parameters to retrieve
   * @returns parameter names and values, where the values are secrets
   */
  getSecrets(scope: cdk.Construct, parameterNames: string[]): ParameterSecrets {
    const results: { [key: string]: ecs.Secret } = {};
    parameterNames.forEach((parameterName) => {
      results[parameterName] = this.getSecret(scope, parameterName);
    });
    return results;
  }

  /**
   * Create `String` typed parameter in AWS Parameter Store.
   * @param scope a scope in a stack with explicit account/region information
   * @param parameterName name of parameter to create
   * @param parameterValue value of parameter to store
   * @throws Error when parameter name already exists
   */
  createString(scope: cdk.Construct, parameterName: string, parameterValue: string): void {
    new ssm.StringParameter(scope, parameterName, {
      parameterName,
      stringValue: parameterValue,
    });
  }
}

export default new ParameterStore();
