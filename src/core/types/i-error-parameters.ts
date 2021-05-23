/**
 * Object containing invalid parameter names and validation errors.
 *
 * An example object:
 *    {
 *      'name': 'Missing name parameter.',
 *      'email': 'Invalid email address.',
 *    }
 */
export interface IErrorParameters {
  [paramName: string]: string;
}
