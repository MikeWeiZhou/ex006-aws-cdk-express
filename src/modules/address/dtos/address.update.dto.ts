import { Expose } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';
import { IdDto } from '../../../common/dtos';

/**
 * Parameters updating an Address.
 */
export class AddressUpdateDto extends IdDto {
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
