import { Response } from 'express';
import { IDto } from '../../common/dtos/i-dto';
import { ResponseStatusCode } from '../types/response-status-code';

/**
 * API response.
 */
export abstract class IResponse {
  /**
   * Response status code for request.
   */
  readonly status: ResponseStatusCode;

  /**
   * Short description of response.
   */
  readonly message?: string;

  /**
   * Create new API response.
   * @param status http response status code
   * @param message short description of response
   */
  constructor(status: ResponseStatusCode, message?: string) {
    this.status = status;
    this.message = message;
  }

  /**
   * Prepares response data to send back to client.
   * @param rawData raw response data
   * @returns processed response data (may be identical to raw response data)
   */
  prepare(rawData?: any): IDto | void {
    return rawData;
  }

  /**
   * Send response back to client.
   * @param res Express Response
   * @param rawData raw response data
   */
  send(res: Response, rawData?: any): void {
    res.status(this.status).json(this.prepare(rawData));
  }
}
