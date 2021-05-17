import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DuplicateEntryError } from './errors/duplicate-entry.error';
import { ErrorType, IError } from './errors/i.error';
import { InternalError } from './errors/internal.error';
import { InvalidRequestError } from './errors/invalid-request.error';
import { NotFoundError } from './errors/not-found.error';
import { BadRequestResponse } from './responses/bad-request.response';
import { ConflictResponse } from './responses/conflict.response';
import { IErrorParameters } from './responses/i-error.response';
import { InternalErrorResponse } from './responses/internal-error.response';
import { NotFoundResponse } from './responses/not-found.response';

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
   *    app.use(ErrorHandler.handler);
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

    if (ErrorHandler.handleDatabaseErrors(err, req, res, next)) {
      return;
    }
    // Unknown error, not thrown by API Server.
    // Could be from any libraries used: Express, TypeORM, ...
    const response = new InternalErrorResponse(ErrorType.INTERNAL, err.message);
    res.status(response.status).json(response.prepare());

    // unknown invalid request error
    // if (err.status && err.status === 400) {
    //   const response = new BadRequestResponse(ErrorType.INVALID_REQUEST, err.message);
    //   res.status(response.status).json(response.prepare());
    //   return;
    // }
  }

  /**
   * Express resource not found handler middleware.
   *
   * Register this function as a middleware, after all other middlewares,
   * but before ErrorHandler.errorHandler():
   *    app.use(...);
   *    app.use(ErrorHandler.GeneralErrorHandler);
   *    app.use(ErrorHandler.NotFoundHandler);
   */
  static NotFoundHandler(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError(`Resource is not found at: {${req.method}} ${req.originalUrl}`));
  }

  /**
   * Handles database errors.
   * @param err error object
   * @param req Express request
   * @param res Express response
   * @param next Express NextFunction
   */
  static handleDatabaseErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean {
    if (err instanceof QueryFailedError) {
      const error = err as any;
      if (error.code === 'ER_DUP_ENTRY') {
        const response = new ConflictResponse(ErrorType.DUPLICATE_ENTRY, error.message);
        res.status(response.status).json(response.prepare());
        return true;
      }
    }

    return false;
  }

  /**
   * Handles type `IErrors`.
   * @param err error object
   * @param req Express request
   * @param res Express response
   * @param next Express NextFunction
   */
  static handleIErrors(
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
      res.status(response.status).json(response.prepare());
      return true;
    }

    if (err instanceof InvalidRequestError) {
      const params: IErrorParameters = {};
      err.validationErrors?.forEach((validationError) => {
        if (validationError.constraints) {
          [params[validationError.property]] = Object.values(validationError.constraints);
        } else {
          params[validationError.property] = 'unknown error with parameter';
        }
      });
      const response = new BadRequestResponse(err.type, err.message, params);
      res.status(response.status).json(response.prepare());
      return true;
    }

    if (err instanceof NotFoundError) {
      const response = new NotFoundResponse(err.type, err.message);
      res.status(response.status).json(response.prepare());
      return true;
    }

    if (err instanceof DuplicateEntryError) {
      const response = new ConflictResponse(err.type, err.message, err.params);
      res.status(response.status).json(response.prepare());
      return true;
    }

    // has base error type of IError, but not handled
    const response = new InternalErrorResponse(ErrorType.INTERNAL, err.message);
    res.status(response.status).json(response.prepare());
    return true;
  }
}

export default new ErrorHandler();
