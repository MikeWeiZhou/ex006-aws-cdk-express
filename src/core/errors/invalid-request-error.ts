import { IErrorParameters } from '../types';
import { ErrorType } from '../types/error-type';
import { IError } from './i-error';

/**
 * Invalid request errors arise when request has invalid parameters.
 */
export class InvalidRequestError extends IError {
  /**
   * Key-values of parameter validation errors.
   */
  readonly params?: IErrorParameters;

  /**
   * Create new invalid request error.
   * @param params param validation errors
   * @param [message='An unknown invalid request error occurred.'] short description of error
   */
  constructor(
    params?: IErrorParameters,
    message: string = 'An unknown invalid request error occurred.',
  ) {
    super(ErrorType.INVALID_REQUEST, message);

    this.params = params;
  }
}
