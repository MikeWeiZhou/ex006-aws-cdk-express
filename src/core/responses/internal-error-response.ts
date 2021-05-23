import { ErrorType } from '../types/error-type';
import { IErrorResponseData } from '../types/i-error-response-data';
import { ResponseStatusCode } from '../types/response-status-code';
import { IErrorResponse } from './i-error-response';

/**
 * An unexpected error occurred inside the API.
 */
export class InternalErrorResponse extends IErrorResponse {
  /**
   * Constructor.
   * @param type type of error
   * @param [message='An unknown server error has occurred.'] short description of error
   */
  constructor(type: ErrorType, message: string = 'An unknown server error has occurred.') {
    super(ResponseStatusCode.INTERNAL_ERROR, type, message);
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
