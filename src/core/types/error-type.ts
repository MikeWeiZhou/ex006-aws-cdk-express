/**
 * Different error types for a given request.
 */
export enum ErrorType {
  /** Some database-level error. */
  DUPLICATE = 'DuplicateError',
  /** Some unexpected error in the server. */
  INTERNAL = 'InternalError',
  /** Invalid request errors arise when request has invalid parameters. */
  INVALID_REQUEST = 'InvalidRequestError',
  /** The requested resource doesn't exist. */
  NOT_FOUND = 'NotFoundError',
}
