import { Expose } from 'class-transformer';
import { Length } from 'class-validator';
import { IDto } from './i.dto';

/**
 * DTO containing only resource ID.
 */
export class IdDto implements IDto {
  /**
   * Resource ID.
   */
  @Expose()
  @Length(25, 25)
  readonly id!: string;
}
