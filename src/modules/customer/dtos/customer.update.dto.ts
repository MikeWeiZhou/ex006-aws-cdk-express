import { IdDto } from '@ear/common/dtos';
import { IsMaxLength, IsUndefinable } from '@ear/common/validators';
import { AddressNestedUpdateDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Customer } from '../customer.model';

/**
 * Parameters required for updating a Customer.
 */
export class CustomerUpdateDto extends IdDto {
  @Expose()
  @Type(() => AddressNestedUpdateDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: AddressNestedUpdateDto;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Customer.limits.FIRST_NAME_MAX_LENGTH)
  readonly firstName?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Customer.limits.LAST_NAME_MAX_LENGTH)
  readonly lastName?: string;

  @Expose()
  @IsUndefinable()
  @IsEmail()
  @IsMaxLength(Customer.limits.EMAIL_MAX_LENGTH)
  readonly email?: string;
}
