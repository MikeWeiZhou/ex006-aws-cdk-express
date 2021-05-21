import { ResponseStatusCode } from './i.response';
import { ErrorType } from '../errors/i.error';
import { IErrorParameters, IErrorResponse, IErrorResponseData } from './i-error.response';

/**
 * Bad request: the request was unacceptable, often due to invalid or missing parameters.
 */
export class BadRequestResponse extends IErrorResponse {
  /**
   * Create a bad request response.
   * @param type type of error
   * @param [message='An unkonwn bad request had occurred.'] short description of error
   * @param params parameter validation errors, if there are any
   */
  constructor(
    type: ErrorType,
    message: string = 'An unknown bad request had occurred.',
    params?: IErrorParameters,
  ) {
    super(ResponseStatusCode.BAD_REQUEST, type, message, params);
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
