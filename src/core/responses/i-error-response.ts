import { Response } from 'express';
import { ErrorType } from '../types/error-type';
import { IErrorParameters } from '../types/i-error-parameters';
import { IErrorResponseData } from '../types/i-error-response-data';
import { ResponseStatusCode } from '../types/response-status-code';
import { IResponse } from './i-response';

/**
 * An error occurred when processing request.
 */
export abstract class IErrorResponse extends IResponse {
  /**
   * Short description of response.
   */
  readonly message: string;

  /**
   * Type of error.
   */
  readonly type: ErrorType;

  /**
   * Parameter-specific errors.
   */
  readonly params?;

  /**
   * Create a bad request response.
   * @param type type of error
   * @param [message='An unknown error has occurred.'] short description of error
   * @param params parameter validation errors, if there are any
   */
  constructor(
    status: ResponseStatusCode,
    type: ErrorType,
    message: string = 'An unknown error has occurred.',
    params?: IErrorParameters,
  ) {
    super(status, message);
    this.type = type;
    this.message = message;
    this.params = params;
  }

  /**
   * @override
   * Prepares error response to send back to client.
   * @returns response object
   */
  abstract prepare(): IErrorResponseData;

  /**
   * @override
   * Send response back to client.
   * @param res Express Response
   */
  send(res: Response): void {
    res.status(this.status).json(this.prepare());
  }
}
