import { ErrorType } from '../types/error-type';
import { IErrorParameters } from '../types/i-error-parameters';
import { IErrorResponseData } from '../types/i-error-response-data';
import { ResponseStatusCode } from '../types/response-status-code';
import { IErrorResponse } from './i-error-response';

/**
 * Conflicted request: resource create/update will lead to a duplicate entry in database.
 */
export class ConflictResponse extends IErrorResponse {
  /**
   * Constructor.
   * @param type type of error
   * @param [message='An unkonwn bad request had occurred.'] short description of error
   * @param params parameter validation errors, if there are any
   */
  constructor(
    type: ErrorType,
    message: string = 'An unknown error had occurred.',
    params?: IErrorParameters,
  ) {
    super(ResponseStatusCode.CONFLICT, type, message, params);
  }

  /**
   * @override
   * Prepare response data to send back to client.
   * @returns response data
   */
  prepare(): IErrorResponseData {
    return {
      type: this.type,
      status: this.status,
      message: this.message,
      params: this.params,
    };
  }
}
