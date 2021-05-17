import { IErrorParameters } from '../responses/i-error.response';
import { ErrorType, IError } from './i.error';

/**
 * Request will lead to duplicate entries in database.
 */
export class DuplicateEntryError extends IError {
  /**
   * Parameters causing the duplicate entry.
   */
  readonly params?: IErrorParameters;

  /**
   * Create new invalid request error.
   * @param [params] params causing duplicate entry
   * @param [message='Duplicate entry error.'] short description of error
   */
  constructor(
    params?: IErrorParameters,
    message: string = 'Duplicate entry error.',
  ) {
    super(ErrorType.DUPLICATE_ENTRY, message);
    this.params = params;
  }
}
