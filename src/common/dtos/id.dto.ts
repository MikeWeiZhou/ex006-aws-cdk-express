import { Expose } from 'class-transformer';
import { IsResourceId } from '../validators';
import { IDto } from './i.dto';

/**
 * DTO containing only resource ID.
 */
export class IdDto implements IDto {
  /**
   * Resource ID.
   */
  @Expose()
  @IsResourceId()
  readonly id!: string;
}
