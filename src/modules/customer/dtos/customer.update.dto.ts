import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, Length, ValidateNested } from 'class-validator';
import { IdDto } from '../../../common/dtos';
import { AddressNestedUpdateDto } from '../../address/dtos';

/**
 * Parameters required for updating a Customer.
 */
export class CustomerUpdateDto extends IdDto {
  @Expose()
  @Type(() => AddressNestedUpdateDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly address?: AddressNestedUpdateDto;

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
}
