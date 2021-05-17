import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { IDto } from './i.dto';

/**
 * Options for listing a resource type.
 */
export class ListOptionsDto implements IDto {
  /**
   * Maximum number of objects to return. Defaults to 10.
   */
  @Expose()
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit: number = 10;

  /**
   * Page number.
   *
   * The results returned would be offset by limit * (page - 1).
   */
  @Expose()
  @IsOptional()
  @IsPositive()
  @IsInt()
  page?: number;
}
