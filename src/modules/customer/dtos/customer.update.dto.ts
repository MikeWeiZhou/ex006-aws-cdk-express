import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { IdDto } from '../../../common/dtos';

/**
 * Parameters required for updating a Customer.
 */
export class CustomerUpdateDto extends IdDto {
  @Expose()
  @IsOptional()
  @Length(2, 50)
  readonly firstName?: string;

  @Expose()
  @IsOptional()
  @Length(2, 50)
  readonly lastName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(5, 100)
  readonly email?: string;

  @Expose()
  @IsOptional()
  @Length(5, 100)
  readonly streetAddress?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly city?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly state?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly country?: string;
}
