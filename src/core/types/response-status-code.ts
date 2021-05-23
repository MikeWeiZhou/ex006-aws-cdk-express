/**
 * Different http response status code for a given request.
 */
export enum ResponseStatusCode {
  /** Everything worked as expected. */
  OK = 200,
  /** Resource has been created. */
  CREATED = 201,
  /** Request is valid, but no resources to return. */
  NO_CONTENT = 204,
  /** Bad request: the request was unacceptable, often due to invalid or missing parameters. */
  BAD_REQUEST = 400,
  /** No valid JSON Web Token provided. */
  // UNAUTHORIZED = 401,
  /** The JSON Web Token provided doesn't have permission to perform the request. */
  // FORBIDDEN = 403,
  /** Request will lead to duplicate entries in database. */
  CONFLICT = 409,
  /** The requested resource doesn't exist. */
  NOT_FOUND = 404,
  /** Some unexpected error in the server. */
  INTERNAL_ERROR = 500,
}
