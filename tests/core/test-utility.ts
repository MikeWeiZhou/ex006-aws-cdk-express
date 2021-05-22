/* eslint-disable jest/no-standalone-expect */
import { Response } from 'supertest';

/**
 * A group of functions to help test the API server.
 */
export class TestUtility {
  /**
   * Expects request to return expected invalid parameters.
   * @param data data to send
   * @param expectedInvalidParams list of parameters that should be invalid
   */
  expectRequestInvalidParams(
    response: Response,
    expectedInvalidParams: string[],
  ): void {
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.type).toBe('InvalidRequestError');
    const invalidParams = Object.keys(response.body.params);
    expect(invalidParams.length).toBe(expectedInvalidParams.length);
    expectedInvalidParams.forEach((param) => {
      expect(invalidParams).toContain(param);
    });
  }
}

export const testUtility = new TestUtility();
