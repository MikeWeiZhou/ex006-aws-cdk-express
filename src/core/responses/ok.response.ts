import { IOkResponse } from './i-ok.response';
import { ResponseStatusCode } from './i.response';

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
