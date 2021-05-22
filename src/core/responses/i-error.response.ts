import { IDto } from '@ear/common/dtos';
import { Response } from 'express';
import { ErrorType } from '../errors/i.error';
import { IResponse, ResponseStatusCode } from './i.response';

/**
 * Object containing invalid parameter names and validation errors.
 *
 * An example object:
 *    {
 *      'name': 'Missing name parameter.',
 *      'email': 'Invalid email address.',
 *    }
 */
export interface IErrorParameters {
  [paramName: string]: string;
}

/**
 * Response data for an error response.
 */
export interface IErrorResponseData extends IDto {
  /**
   * Type of error.
   */
  readonly type: ErrorType;

  /**
   * HTTP response status code.
   */
  readonly status: ResponseStatusCode;

  /**
   * A human-readable message providing more details about the error.
   */
  readonly message: string;

  /**
   * If the error is parameter-specific, will provide a list of parameters and their
   * errors. For example, can be used to display a message near the correct form field.
   */
  readonly params?: IErrorParameters;
}

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
