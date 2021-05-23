import { ErrorType } from '../types/error-type';

/**
 * API error.
 */
export abstract class IError extends Error {
  /**
   * Type of error.
   */
  readonly type: ErrorType;

  /**
   * Create new API error.
   * @param type type of error
   * @param [message='An unknown error occured.'] short description of error
   */
  constructor(type: ErrorType, message: string = 'An unknown error occured.') {
    super(message);
    this.type = type;
  }
}
