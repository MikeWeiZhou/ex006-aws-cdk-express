import { IOkResponse } from './i-ok.response';
import { ResponseStatusCode } from './i.response';

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
