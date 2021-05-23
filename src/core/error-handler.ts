import { ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DuplicateError, IError, InternalError, InvalidRequestError, NotFoundError } from './errors';
import { BadRequestResponse, ConflictResponse, InternalErrorResponse, NotFoundResponse } from './responses';
import { ErrorType, IErrorParameters } from './types';

/**
 * Error handler maps an error to a response.
 */
export class ErrorHandler {
  /**
   * Express global error handler function.
   *
   * Register this function as a middleware, after all other routers and middlewares:
   *    app.use(...);
   *    app.use(...);
   *    app.use(ErrorHandler.GeneralErrorHandler);
   *
   * @param err error object
   * @param req Express request
   * @param res Express response
   * @param next Express NextFunction
   */
  static GeneralErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (ErrorHandler.handleIErrors(err, req, res, next)) {
      return;
    }

    if (ErrorHandler.handleExpressErrors(err, req, res, next)) {
      return;
    }

    if (ErrorHandler.handleDatabaseErrors(err, req, res, next)) {
      return;
    }

    // unknown error, could be from any libraries used
    const response = new InternalErrorResponse(ErrorType.INTERNAL, err.message);
    response.send(res);
  }

  /**
   * Express resource not found handler middleware.
   *
   * Register this function as a middleware, after all other middlewares,
   * but before ErrorHandler.GeneralErrorHandler():
   *    app.use(...);
   *    app.use(ErrorHandler.NotFoundHandler);
   *    app.use(ErrorHandler.GeneralErrorHandler);
   */
  static NotFoundHandler(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError(`Resource is not found at: {${req.method}} ${req.originalUrl}`));
  }

  /**
   * Handles errors originated from Express.js.
   * @param err error object
   * @param req Express request
   * @param res Express response
   * @param next Express NextFunction
   */
  private static handleExpressErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean {
    const error = err as any;

    if (!error.status || !error.type) {
      return false;
    }

    // invalid json; cannot parse json
    if (error.status === 400 && error.type === 'entity.parse.failed') {
      const response = new BadRequestResponse(ErrorType.INVALID_REQUEST, `Invalid JSON syntax: ${error.message}`);
      response.send(res);
      return true;
    }

    return false;
  }

  /**
   * Handles errors originated from the database or ORM.
   * @param err error object
   * @param req Express request
   * @param res Express response
   * @param next Express NextFunction
   */
  private static handleDatabaseErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean {
    if (err instanceof QueryFailedError) {
      const error = err as any;
      // duplicate entry in database from unique constraints
      if (error.code === 'ER_DUP_ENTRY') {
        const response = new ConflictResponse(ErrorType.DUPLICATE, error.message);
        response.send(res);
        return true;
      }
      // non-existent row from foreign key constraints
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        const response = new BadRequestResponse(
          ErrorType.INVALID_REQUEST,
          'A resource ID in request does not exist.',
        );
        response.send(res);
        return true;
      }
    }

    return false;
  }

  /**
   * Handles errors we threw ourselves (e.g. in service or controller layer).
   * @param err error object
   * @param req Express request
   * @param res Express response
   * @param next Express NextFunction
   */
  private static handleIErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean {
    if (!(err instanceof IError)) {
      return false;
    }

    if (err instanceof InternalError) {
      const response = new InternalErrorResponse(err.type, err.message);
      response.send(res);
      return true;
    }

    if (err instanceof InvalidRequestError) {
      const params: IErrorParameters = (err.validationErrors)
        ? ErrorHandler.toErrorParameters(err.validationErrors)
        : {};
      const response = new BadRequestResponse(err.type, err.message, params);
      response.send(res);
      return true;
    }

    if (err instanceof NotFoundError) {
      const response = new NotFoundResponse(err.type, err.message);
      response.send(res);
      return true;
    }

    if (err instanceof DuplicateError) {
      const response = new ConflictResponse(err.type, err.message, err.params);
      response.send(res);
      return true;
    }

    // has base error type of IError, but not handled
    const response = new InternalErrorResponse(ErrorType.INTERNAL, err.message);
    response.send(res);
    return true;
  }

  /**
   * Flatten ValidationErrors into IErrorParameters object
   * @param validationErrors validation errors from class-validator
   * @param paramPrefix prefix for parameter name (used for nested validation)
   * @returns flat IErrorParameters oject
   */
  private static toErrorParameters(
    validationErrors: ValidationError[],
    paramPrefix?: string,
  ): IErrorParameters {
    let params: IErrorParameters = {};
    validationErrors.forEach((validationError) => {
      const { property, constraints, children } = validationError;
      const paramName = (paramPrefix)
        ? `${paramPrefix}${property}`
        : property;
      if (constraints) {
        // use first constraint error only
        [params[paramName]] = Object.values(constraints);
      } else if (children) {
        const childParams = ErrorHandler.toErrorParameters(children, `${paramName}.`);
        params = {
          ...params,
          ...childParams,
        };
      } else {
        params[paramName] = 'invalid or missing parameter';
      }
    });
    return params;
  }
}
