/**
 * Different error types for a given request.
 */
export enum ErrorType {
  /** Attempted to create or update resource which will lead to a duplicate entry in database. */
  DUPLICATE_ENTRY = 'DuplicateEntryError',
  /** Some unexpected error in the API. */
  INTERNAL = 'InternalError',
  /** Invalid request errors arise when request has invalid parameters. */
  INVALID_REQUEST = 'InvalidRequestError',
  /** The requested resource doesn't exist. */
  NOT_FOUND = 'NotFoundError',
}

/**
 * API error.
 */
export abstract class IError extends Error {
  /**
   * Type of error.
   */
  readonly type: ErrorType;

  /**
   * Create new API error.
   * @param type type of error
   * @param [message='An unknown error occured.'] short description of error
   */
  constructor(type: ErrorType, message: string = 'An unknown error occured.') {
    super(message);
    this.type = type;
  }
}
