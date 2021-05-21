import { IErrorParameters } from '../responses/i-error.response';
import { ErrorType, IError } from './i.error';

/**
 * Request will lead to duplicate entries in database.
 */
export class DuplicateError extends IError {
  /**
   * Parameters causing the duplicate entry.
   */
  readonly params?: IErrorParameters;

  /**
   * Constructor.
   * @param params params causing database error
   * @param [message='Duplicate entry error.'] short description of error
   */
  constructor(
    params?: IErrorParameters,
    message: string = 'Duplicate entry error.',
  ) {
    super(ErrorType.DUPLICATE, message);
    this.params = params;
  }
}
