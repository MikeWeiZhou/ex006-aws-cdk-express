import { ErrorType } from './error-type';
import { IErrorParameters } from './i-error-parameters';
import { ResponseStatusCode } from './response-status-code';

/**
 * Response data for an error response.
 */
export interface IErrorResponseData {
  /**
   * Type of error.
   */
  readonly type: ErrorType;

  /**
   * HTTP response status code.
   */
  readonly status: ResponseStatusCode;

  /**
   * A human-readable message providing more details about the error.
   */
  readonly message: string;

  /**
   * If the error is parameter-specific, will provide a list of parameters and their
   * errors. For example, can be used to display a message near the correct form field.
   */
  readonly params?: IErrorParameters;
}
