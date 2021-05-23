import { Response } from 'express';
import { ResponseStatusCode } from '../types/response-status-code';
import { IOkResponse } from './i-ok-response';

/**
 * Request was successful, but no content to display.
 */
export class NoContentResponse extends IOkResponse {
  /**
   * Constructor.
   */
  constructor() {
    super(ResponseStatusCode.NO_CONTENT);
  }

  /**
   * @override
   * Does nothing.
   * @returns nothing
   */
  prepare(): void {}

  /**
   * @override
   * Send response back to client.
   * @param res Express Response
   */
  send(res: Response): void {
    res.status(this.status).json(this.prepare());
  }
}
