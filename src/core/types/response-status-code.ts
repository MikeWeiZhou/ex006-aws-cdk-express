/**
 * Different http response status code for a given request.
 */
export enum ResponseStatusCode {
  /** Everything worked as expected. */
  OK = 200,
  /** Resource has been created. */
  CREATED = 201,
  /** Successful request with no response body, often comes after a successful delete. */
  NO_CONTENT = 204,
  /** Invalid request, often due to invalid or missing parameters. */
  BAD_REQUEST = 400,
  /** The requested resource doesn't exist. */
  NOT_FOUND = 404,
  /** Request will lead to data conflict, usually from database constraints. */
  CONFLICT = 409,
  /** Some unexpected error in the server. */
  INTERNAL_ERROR = 500,
}
