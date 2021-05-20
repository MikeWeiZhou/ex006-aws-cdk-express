import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { IDto } from '../common/dtos';
import { dtoUtility } from '../utilities';
import { InternalError, InvalidRequestError } from './errors';
import { CreatedResponse, InternalErrorResponse, IResponse, NoContentResponse, OkResponse } from './responses';

/**
 * Options for controller decorator behavior.
 */
export interface ControllerDecoratorProperties<ReqDto, ResDto extends IDto> {
  /**
   * These request parameters in URL will be merged into request body.
   * They will be accessible by DTO and req.body.
   */
  mergeParams?: string[];

  /**
   * Request body parameters will be sanitized and validated to this DTO specification.
   */
  requestDto: ClassConstructor<ReqDto>;

  /**
   * Controller function return value will be sanitiezed to this DTO specification before
   * returning the response to the client.
   */
  responseDto?: ClassConstructor<ResDto>;
}

/**
 * Options for controller decorator factory.
 */
export interface ControllerDecoratorFactoryProperties<ReqDto, ResDto extends IDto>
extends ControllerDecoratorProperties<ReqDto, ResDto> {
  /**
   * API Response object.
   */
  apiResponse: () => IResponse;
}

/**
 * CRUD controller decorators help process request data and generate responses.
 */
export class ControllerDecorator<ReqDto, ResDto extends IDto> {
  /**
   * POST request.
   *
   * Request data: sanitizes and validates request data against given request DTO.
   * Response data: sanitizes outgoing response data, if any.
   *
   * Expected method signature of decorated function:
   *    (reqDto: IDto) => Promise<IDto>
   *
   * @param props options for decorator
   */
  Create(props: ControllerDecoratorProperties<ReqDto, ResDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      responseDto: props.responseDto,
      mergeParams: props.mergeParams,
      apiResponse: () => new CreatedResponse(),
    });
  }

  /**
   * GET request for a single resource.
   *
   * Request data: sanitizes and validates request data against given request DTO.
   * Response data: sanitizes outgoing response data, if any.
   *
   * Expected method signature of decorated function:
   *    (reqDto: IDto) => Promise<IDto>
   *
   * @param props options for decorator
   */
  Get(props: ControllerDecoratorProperties<ReqDto, ResDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      responseDto: props.responseDto,
      mergeParams: props.mergeParams,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * PATCH request.
   *
   * Request data: sanitizes and validates request data against given request DTO.
   * Response data: sanitizes outgoing response data, if any.
   *
   * Expected method signature of decorated function:
   *    (reqDto: IDto) => Promise<IDto>
   *
   * @param props options for decorator
   */
  Update(props: ControllerDecoratorProperties<ReqDto, ResDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      responseDto: props.responseDto,
      mergeParams: props.mergeParams,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * DELETE request.
   *
   * Request data: sanitizes and validates request data against given request DTO.
   * Response data: sanitizes outgoing response data, if any.
   *
   * Expected method signature of decorated function:
   *    (reqDto: IDto) => Promise<void>
   *
   * @param props options for decorator
   */
  Delete(props: ControllerDecoratorProperties<ReqDto, ResDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      responseDto: props.responseDto,
      mergeParams: props.mergeParams,
      apiResponse: () => new NoContentResponse(),
    });
  }

  /**
   * GET request for multiple resources.
   *
   * Request data: sanitizes and validates request data against given request DTO.
   * Response data: sanitizes outgoing response data, if any.
   *
   * Expected method signature of decorated function:
   *    (reqDto: IDto) => Promise<IDto[]>
   *
   * @param props options for decorator
   */
  List(props: ControllerDecoratorProperties<ReqDto, ResDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      responseDto: props.responseDto,
      mergeParams: props.mergeParams,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * Build controller method decorators.
   * @param props options for decorator
   * @returns MethodDecorator
   */
  private buildDecorator(
    props: ControllerDecoratorFactoryProperties<ReqDto, ResDto>,
  ): MethodDecorator {
    // save this reference
    const controllerDecorator = this;

    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      // controller function that is decorated
      const controllerFunction = descriptor.value;

      // wrap controller function
      descriptor.value = async function () { // eslint-disable-line no-param-reassign
        const [req, res, next]: [Request, Response, NextFunction] = arguments as any;

        try {
          // merge req.params into req.body
          if (props.mergeParams) {
            controllerDecorator.mergeUrlParamsOrFail(props.mergeParams, req, res);
          }

          // sanitize and validate request body against specified DTO
          const requestDto = dtoUtility.sanitizeToDto(props.requestDto, req.body);
          await controllerDecorator.validateDtoOrFail(requestDto);

          // call controller function with different arguments
          const args = [requestDto];
          const controllerReturnValue: ResDto | undefined = await controllerFunction.apply(
            this,
            args,
          );

          // sanitize response data, if any
          let responseData: ResDto | ResDto[] | undefined;
          if (props.responseDto) {
            if (typeof controllerReturnValue === 'undefined') {
              throw new InternalError('Expected controller function return value, but received undefined.');
            }
            responseData = dtoUtility.sanitizeToDto(props.responseDto, controllerReturnValue);
          }

          // send response back to client
          const apiResponse = props.apiResponse();
          apiResponse.send(res, responseData);
        } catch (error) {
          next(error);
        }
      };
      return descriptor;
    };
  }

  /**
   * Validate DTO or fail.
   * @param dto DTO instance
   */
  private async validateDtoOrFail<Dto extends IDto>(dto: Dto): Promise<void> {
    const validationErrors = await dtoUtility.validateDto(dto);
    if (validationErrors.length > 0) {
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
        throw new InvalidRequestError(
          [{
            property: param,
            constraints: {
              duplicateParam: `Request parameter ${param} needs to be identical in URL and request body`,
            },
          }],
          `Cannot have different values for parameter ${param} in URL and request body.`,
        );
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
