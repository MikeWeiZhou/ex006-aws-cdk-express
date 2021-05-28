/**
 * Different error types for a given request.
 */
export enum ErrorType {
  /** Database constraint duplicate error. */
  DUPLICATE = 'DuplicateError',
  /** Some unexpected error in the server. */
  INTERNAL = 'InternalError',
  /** Request has invalid or missing parameters. */
  INVALID_REQUEST = 'InvalidRequestError',
  /** The requested resource doesn't exist. */
  NOT_FOUND = 'NotFoundError',
}
