import { Expose } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';
import { IDto } from '../../../common/dtos';

/**
 * Parameters updating an Address that is nested into another model.
 */
export class AddressNestedUpdateDto implements IDto {
  @Expose()
  @IsOptional()
  @Length(5, 150)
  readonly address?: string;

  @Expose()
  @IsOptional()
  @Length(5, 10)
  readonly postcode?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly city?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly province?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly country?: string;
}
