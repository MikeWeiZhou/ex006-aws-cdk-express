import { Expose } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { IsUndefinable } from '../validators/is-undefinable';
import { IDto } from './i-dto';

/**
 * Options for listing a resource type.
 */
export class ListOptionsDto implements IDto {
  /**
   * Maximum number of objects to return. Defaults to 10.
   */
  @Expose()
  @IsUndefinable()
  @IsPositive()
  @IsInt()
  readonly limit: number = 10;

  /**
   * Page number.
   *
   * The results returned would be offset by limit * (page - 1).
   */
  @Expose()
  @IsUndefinable()
  @IsPositive()
  @IsInt()
  readonly page?: number;
}
