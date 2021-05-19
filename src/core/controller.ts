import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { IDto } from '../common/dtos';
import { dtoUtility } from '../utilities';
import { InternalError, InvalidRequestError } from './errors';
import { CreatedResponse, IResponse, NoContentResponse, OkResponse } from './responses';

/**
 * Options for controller decorator behavior.
 */
export interface ControllerDecoratorProperties<ReqDto extends IDto> {
  /**
   * These request parameters in URL will be merged into request body.
   * They will be accessible by DTO and req.body.
   */
  mergeParams?: string[];

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
   * Sanitizes and validates request data against given DTO.
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
      mergeParams: props.mergeParams,
      apiResponse: () => new CreatedResponse(),
    });
  }

  /**
   * GET request for a single resource.
   *
   * Sanitizes and validates request data against given DTO.
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
      mergeParams: props.mergeParams,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * PATCH request.
   *
   * Sanitizes and validates request data against given DTO.
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
      mergeParams: props.mergeParams,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * DELETE request.
   *
   * Sanitizes and validates request data against given DTO.
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
      mergeParams: props.mergeParams,
      apiResponse: () => new NoContentResponse(),
    });
  }

  /**
   * GET request for multiple resources.
   *
   * Sanitizes and validates request data against given DTO.
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
      mergeParams: props.mergeParams,
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
          if (props.mergeParams) {
            controllerDecorator.mergeUrlParamsOrFail(props.mergeParams, req, res);
          }

          // sanitize and validate request body against specified DTO
          const dto = (props.requestDto)
            ? await controllerDecorator.getDtoOrFail(props.requestDto, req.body)
            : undefined;

          // call controller function with different arguments
          const args = [dto, req, res];
          const responseDto: IDto | undefined = await controllerFunction.apply(this, args);

          // send response back to client
          const apiResponse = props.apiResponse();
          apiResponse.send(res, responseDto);
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
export const Controller = new ControllerDecorator();
