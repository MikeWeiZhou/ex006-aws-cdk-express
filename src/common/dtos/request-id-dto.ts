import { Expose } from 'class-transformer';
import { IsResourceId } from '../validators/is-resource-id';
import { IDto } from './i-dto';

/**
 * Request resource ID parameter sanitized and validated to spec.
 */
export class RequestIdDto implements IDto {
  /**
   * Resource ID.
   */
  @Expose()
  @IsResourceId()
  readonly id!: string;
}
