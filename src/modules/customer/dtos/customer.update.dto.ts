import { IdDto } from '@ear/common/dtos';
import { AddressNestedUpdateDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, Length, ValidateNested } from 'class-validator';

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
  @Length(1, 50)
  readonly firstName?: string;

  @Expose()
  @IsOptional()
  @Length(1, 50)
  readonly lastName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  readonly email?: string;
}
