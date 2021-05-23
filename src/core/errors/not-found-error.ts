import { ErrorType } from '../types/error-type';
import { IError } from './i-error';

/**
 * The requested resource doesn't exist.
 */
export class NotFoundError extends IError {
  /**
   * Create new not found error.
   * @param [message='Cannot find resource.'] short description of error
   */
  constructor(message: string = 'Cannot find resource.') {
    super(ErrorType.NOT_FOUND, message);
  }
}
