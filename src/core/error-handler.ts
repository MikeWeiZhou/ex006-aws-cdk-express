import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import {
  DuplicateError,
  ErrorType,
  IError,
  InternalError,
  InvalidRequestError,
  NotFoundError,
} from './errors';
import {
  BadRequestResponse,
  ConflictResponse,
  IErrorParameters,
  InternalErrorResponse,
  NotFoundResponse,
} from './responses';

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
    res.status(response.status).json(response.prepare());
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
  static handleExpressErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean {
    if (err instanceof SyntaxError) {
      const error = err as any;
      // invalid json; cannot parse json
      if (error.status === 400 && error.type === 'entity.parse.failed') {
        const response = new BadRequestResponse(ErrorType.INVALID_REQUEST, error.message);
        res.status(400).json(response.prepare());
        return true;
      }
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
  static handleDatabaseErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean {
    if (err instanceof QueryFailedError) {
      const error = err as any;
      // duplicate entry in database from constraints
      if (error.code === 'ER_DUP_ENTRY') {
        const response = new ConflictResponse(ErrorType.DUPLICATE, error.message);
        res.status(response.status).json(response.prepare());
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

    if (err instanceof DuplicateError) {
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
