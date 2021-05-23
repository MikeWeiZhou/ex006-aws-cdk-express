import { ClassConstructor } from 'class-transformer';
import { IDto } from '../../common/dtos/i-dto';
import { ResponseStatusCode } from './response-status-code';

/**
 * Properties for using controller decorator.
 */
export interface ControllerDecoratorProperties<ReqDto, ResDto extends IDto> {
  /**
   * These request parameters in URL will be merged into request body.
   * They will be accessible through req.body.
   */
  mergeParams?: string[];

  /**
   * Request body parameters will be sanitized and validated to this DTO specification and sent
   * to controller method as the only argument.
   */
  requestDto: ClassConstructor<ReqDto>;

  /**
   * Controller method return value will be sanitized to this DTO specification before
   * returning the response to client.
   */
  responseDto?: ClassConstructor<ResDto>;

  /**
   * Type of API response on successful request.
   */
  responseStatusCode: ResponseStatusCode.CREATED
    | ResponseStatusCode.OK
    | ResponseStatusCode.NO_CONTENT;
}
