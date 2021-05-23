import { ResponseStatusCode } from '../types/response-status-code';
import { IOkResponse } from './i-ok-response';

/**
 * Created resource successfully.
 */
export class CreatedResponse extends IOkResponse {
  /**
   * Constructor.
   */
  constructor() {
    super(ResponseStatusCode.CREATED);
  }
}
