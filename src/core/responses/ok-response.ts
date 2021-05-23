import { ResponseStatusCode } from '../types/response-status-code';
import { IOkResponse } from './i-ok-response';

/**
 * Everything worked as expected.
 */
export class OkResponse extends IOkResponse {
  /**
   * Constructor.
   */
  constructor() {
    super(ResponseStatusCode.OK);
  }
}
