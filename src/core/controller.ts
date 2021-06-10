import { NextFunction, Request, Response } from 'express';
import { IDto } from '../common/dtos/i-dto';
import { dtoUtility } from '../utilities/dto-utility';
import { InternalError, InvalidRequestError } from './errors';
import { CreatedResponse, IResponse, NoContentResponse, OkResponse } from './responses';
import { ResponseStatusCode } from './types';
import { ControllerDecoratorProperties } from './types/controller-decorator-properties';

/**
 * Controller decorator help sanitize and validate request body and santize response data.
 */
export class ControllerDecorator<ReqDto, ResDto extends IDto> {
  /**
   * Decorates a Controller method (Express middleware function) to sanitize and validate
   * incoming request data, as well as sanitizing any outgoing response data.
   *
   * Expects the decorated method signature to be:
   *    ```typescript
   *    (requestDto) => Promise<responseDto-like>
   *    ```
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  process(props: ControllerDecoratorProperties<ReqDto, ResDto>): MethodDecorator {
    // save this reference
    const thisArg = this;

    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      // controller function that is decorated
      const controllerMethod = descriptor.value;

      // wrap controller function
      descriptor.value = async function () { // eslint-disable-line no-param-reassign
        const [req, res, next]: [Request, Response, NextFunction] = arguments as any;

        try {
          // merge req.params into req.body
          if (props.mergeParams) {
            thisArg.mergeUrlParamsOrFail(props.mergeParams, req, res);
          }

          // sanitize and validate request body against requestDTO
          const requestDto = dtoUtility.sanitizeToDto(props.requestDto, req.body);
          if (Array.isArray(requestDto)) {
            throw new InvalidRequestError(undefined, 'Request body cannot be an array. Must be an object');
          }
          await thisArg.validateDtoOrFail(requestDto);

          // call controller method with requestDto
          const args = [requestDto];
          const controllerReturnValue: ResDto | undefined = await controllerMethod.apply(
            this,
            args,
          );

          // sanitize controller method return value against responseDto, if any
          let responseData: ResDto | ResDto[] | undefined = controllerReturnValue;
          if (props.responseDto) {
            if (typeof controllerReturnValue === 'undefined') {
              throw new InternalError('Expected controller function return value, but received undefined.');
            }
            responseData = dtoUtility.sanitizeToDto(props.responseDto, controllerReturnValue);
          }

          // send response back to client
          const apiResponse = thisArg
            .getApiResponseObjectOrFail(props.responseStatusCode);
          apiResponse.send(res, responseData);
        } catch (error) {
          next(error);
        }
      };
      return descriptor;
    };
  }

  /**
   * Returns a success API response object or fail.
   * @param responseStatus expected response status code on request success
   * @returns API response object
   */
  private getApiResponseObjectOrFail(responseStatus: ResponseStatusCode): IResponse {
    switch (responseStatus) {
      case ResponseStatusCode.OK:
        return new OkResponse();
      case ResponseStatusCode.CREATED:
        return new CreatedResponse();
      case ResponseStatusCode.NO_CONTENT:
        return new NoContentResponse();
      default:
        throw new InternalError(
          `Controller decorator does not support a success response status code of ${responseStatus}`,
        );
    }
  }

  /**
   * Validate DTO or fail.
   * @param dto DTO instance
   */
  private async validateDtoOrFail<Dto extends IDto>(dto: Dto): Promise<void> {
    const validationErrors = await dtoUtility.validateDto(dto);
    if (validationErrors !== undefined) {
      throw new InvalidRequestError(
        validationErrors,
        'One or more parameters are invalid or missing.',
      );
    }
  }

  /**
   * Merges URL parameters into request body or fail.
   * @param params parameters to merge
   * @param req Express Request
   * @param res Express Response
   */
  private mergeUrlParamsOrFail(params: string[], req: Request, res: Response): void {
    params.forEach((param) => {
      if (typeof req.params[param] === 'undefined') {
        throw new InternalError(`Expecting parameter in URL ${param}, but not found.`);
      }
      if (typeof req.body[param] !== 'undefined' && req.body[param] !== req.params[param]) {
        throw new InvalidRequestError({
          [param]: `${param} needs to be identical in URL and request body`,
        });
      }
      // shallow copy
      req.body[param] = req.params[param];
    });
  }
}

/**
 * Instance of ControllerDecorator.
 */
export const Controller = new ControllerDecorator();
