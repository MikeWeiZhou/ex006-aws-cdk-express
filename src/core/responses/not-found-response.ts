import { ErrorType } from '../types/error-type';
import { IErrorResponseData } from '../types/i-error-response-data';
import { ResponseStatusCode } from '../types/response-status-code';
import { IErrorResponse } from './i-error-response';

/**
 * The resource for the request cannot be found.
 */
export class NotFoundResponse extends IErrorResponse {
  /**
   * Create a not found response.
   * @param type type of error
   * @param [message='Cannot find resource.'] short description of error
   */
  constructor(type: ErrorType, message: string = 'Cannot find resource.') {
    super(ResponseStatusCode.NOT_FOUND, type, message);
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
    };
  }
}
