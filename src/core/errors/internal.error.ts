import { ErrorType, IError } from './i.error';

/**
 * Unexpected error ocurred inside the API.
 */
export class InternalError extends IError {
  /**
   * Create new internal error.
   * @param [message='An unknown server error occurred.'] short description of error
   */
  constructor(message: string = 'An unknown server error occurred.') {
    super(ErrorType.INTERNAL, message);
  }
}
