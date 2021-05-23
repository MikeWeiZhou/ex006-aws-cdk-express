import { ValidationError } from 'class-validator';
import { ErrorType } from '../types/error-type';
import { IError } from './i-error';

/**
 * Invalid request errors arise when request has invalid parameters.
 */
export class InvalidRequestError extends IError {
  /**
   * List of parameter validation errors.
   */
  readonly validationErrors?: ValidationError[];

  /**
   * Create new invalid request error.
   * @param validationErrors param validation errors
   * @param [message='An unknown invalid request error occurred.'] short description of error
   */
  constructor(
    validationErrors?: ValidationError[],
    message: string = 'An unknown invalid request error occurred.',
  ) {
    super(ErrorType.INVALID_REQUEST, message);

    this.validationErrors = validationErrors;
  }
}
