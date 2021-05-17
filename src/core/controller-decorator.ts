import { NextFunction, Response, Request } from 'express';
import { ClassConstructor } from 'class-transformer';
import { CreatedResponse } from './responses/created.response';
import { IDto } from '../common/dtos/i.dto';
import dtoUtility from './dto-utility';
import { InvalidRequestError } from './errors/invalid-request.error';
import { IResponse } from './responses/i.response';
import { InternalError } from './errors/internal.error';
import { OkResponse } from './responses/ok.response';
import { NotFoundError } from './errors/not-found.error';
import { NoContentResponse } from './responses/no-content.response';

/**
 * Options for controller decorator behavior.
 */
export interface ControllerDecoratorProperties {
  /**
   * These request parameters in URL will be merged into request body.
   * They will be accessible by DTO and req.body.
   */
  params?: string[];

  /**
   * Class constructor of DTO to validate against request body.
   */
  dto?: ClassConstructor<IDto>;
}

/**
 * Options for controller decorator factory.
 */
export interface ControllerDecoratorFactoryProperties extends ControllerDecoratorProperties {
  /**
   * API Response object.
   */
  apiResponse: () => IResponse;

  /**
   * Validates response DTO (returned by controller function).
   */
  validateResponseDto?: (responseDto: IDto, req: Request, res: Response) => Promise<void>;
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
  Create(props: ControllerDecoratorProperties): MethodDecorator {
    return this.buildDecorator({
      dto: props.dto,
      params: props.params,
      apiResponse: () => new CreatedResponse(),
    });
  }

  /**
   * GET request for a single resource.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<IDto | undefined>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  Get(props: ControllerDecoratorProperties): MethodDecorator {
    return this.buildDecorator({
      dto: props.dto,
      params: props.params,
      apiResponse: () => new OkResponse(),
      validateResponseDto: async (responseDto: IDto, req: Request, res: Response) => {
        if (typeof responseDto === 'undefined') {
          throw new NotFoundError(`The resource ID ${req.params.id} does not exist.`);
        }
      },
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
  Update(props: ControllerDecoratorProperties): MethodDecorator {
    return this.buildDecorator({
      dto: props.dto,
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
  Delete(props: ControllerDecoratorProperties): MethodDecorator {
    return this.buildDecorator({
      dto: props.dto,
      params: props.params,
      apiResponse: () => new NoContentResponse(),
    });
  }

  /**
   * GET request for multiple resource.
   *
   * Expected method signature of decorated function:
   *    (dto: IDto, req: Request, res: Response) => Promise<IDto[]>
   *
   * @param props options for decorator
   * @returns MethodDecorator
   */
  List(props: ControllerDecoratorProperties): MethodDecorator {
    return this.buildDecorator({
      dto: props.dto,
      params: props.params,
      apiResponse: () => new OkResponse(),
    });
  }

  /**
   * Builds controller decorator.
   * @param props options for decorator
   * @returns method decorator
   */
  private buildDecorator(props: ControllerDecoratorFactoryProperties) {
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
          const dto = (props.dto)
            ? await controllerDecorator.getDtoOrFail(props.dto, req.body)
            : undefined;

          // call controller function with different arguments
          const args = [dto, req, res];
          const responseDto = await controllerFunction.apply(this, args);

          // validate response DTO
          if (props.validateResponseDto) {
            await props.validateResponseDto(responseDto, req, res);
          }

          // sanitize response DTO
          const sanitizedDto = (responseDto)
            ? dtoUtility.sanitizeFromDto(responseDto)
            : undefined;

          // send response back to client
          const apiResponse = props.apiResponse();
          const apiResponseData = apiResponse.prepare(sanitizedDto);
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
  private async getDtoOrFail(dtoConstructor: ClassConstructor<IDto>, dtoLike: IDto): Promise<IDto> {
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

export default new ControllerDecorator();
