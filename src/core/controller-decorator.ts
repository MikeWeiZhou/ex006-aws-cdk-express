import { NextFunction, Response, Request } from 'express';
import { ClassConstructor } from 'class-transformer';
import { IDto } from '../common/dtos';
import {
  CreatedResponse,
  IResponse,
  NoContentResponse,
  OkResponse,
} from './responses';
import { dtoUtility } from '../utilities';
import { InternalError, InvalidRequestError } from './errors';

/**
 * Options for controller decorator behavior.
 */
export interface ControllerDecoratorProperties<ReqDto extends IDto> {
  /**
   * These request parameters in URL will be merged into request body.
   * They will be accessible by DTO and req.body.
   */
  params?: string[];

  /**
   * Class constructor of DTO used to validate against request body.
   */
  requestDto: ClassConstructor<ReqDto>;
}

/**
 * Options for controller decorator factory.
 */
export interface ControllerDecoratorFactoryProperties<ReqDto extends IDto>
extends ControllerDecoratorProperties<ReqDto> {
  /**
   * API Response object.
   */
  apiResponse: () => IResponse;
}

/**
 * Factory to build controller decorators.
 */
export class ControllerDecorator {
  /**
   * POST request.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<IDto>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  Create<ReqDto extends IDto>(
    props: ControllerDecoratorProperties<ReqDto>,
  ): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      params: props.params,
      apiResponse: () => new CreatedResponse(),
    });
  }

  /**
   * GET request for a single resource.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<IDto>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  Get<ReqDto extends IDto>(props: ControllerDecoratorProperties<ReqDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      params: props.params,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * PATCH request for a single resource.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<IDto>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  Update<ReqDto extends IDto>(props: ControllerDecoratorProperties<ReqDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      params: props.params,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * DELETE request for a single resource.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<void>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  Delete<ReqDto extends IDto>(props: ControllerDecoratorProperties<ReqDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      params: props.params,
      apiResponse: () => new NoContentResponse(),
    });
  }

  /**
   * GET request for multiple resources.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<IDto[]>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  List<ReqDto extends IDto>(props: ControllerDecoratorProperties<ReqDto>): MethodDecorator {
    return this.buildDecorator({
      requestDto: props.requestDto,
      params: props.params,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * Build controller method decorators.
   * @param props options for decorator
   * @returns MethodDecorator
   */
  private buildDecorator<ReqDto extends IDto>(
    props: ControllerDecoratorFactoryProperties<ReqDto>,
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
          if (props.params) {
            controllerDecorator.mergeUrlParamsOrFail(props.params, req, res);
          }

          // sanitize and validate request body against specified DTO
          const dto = (props.requestDto)
            ? await controllerDecorator.getDtoOrFail(props.requestDto, req.body)
            : undefined;

          // call controller function with different arguments
          const args = [dto, req, res];
          const responseDto: IDto = await controllerFunction.apply(this, args);

          // send response back to client
          const apiResponse = props.apiResponse();
          const apiResponseData = apiResponse.prepare(responseDto);
          res.status(apiResponse.status).json(apiResponseData);
        } catch (error) {
          next(error);
        }
      };
      return descriptor;
    };
  }

  /**
   * Sanitize and validate request parameters against target DTO or fail.
   * @param dtoConstructor class constructor of target DTO
   * @param dtoLike DTO-like request parameters object (same shape)
   * @returns sanitized and validated DTO
   */
  private async getDtoOrFail<Dto extends IDto>(
    dtoConstructor: ClassConstructor<Dto>,
    dtoLike: Dto,
  ): Promise<Dto> {
    const dto = dtoUtility.sanitizeToDto(dtoConstructor, dtoLike);
    const validationErrors = await dtoUtility.validateDto(dto);
    if (validationErrors.length > 0) {
      throw new InvalidRequestError(
        validationErrors,
        'One or more request parameters are invalid or missing.',
      );
    }
    return dto;
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
export const controllerDecorator = new ControllerDecorator();
