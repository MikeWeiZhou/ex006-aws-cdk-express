import { IsMaxLength, IsUndefinable, RequestIdDto } from '@ear/common';
import { NestedUpdateAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { CustomerEntityConstraints } from '../customer-entity';

/**
 * Update Customer request parameters sanitized and validated to spec.
 */
export class UpdateCustomerDto extends RequestIdDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(CustomerEntityConstraints.FIRST_NAME_MAX_LENGTH)
  readonly firstName?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(CustomerEntityConstraints.LAST_NAME_MAX_LENGTH)
  readonly lastName?: string;

  @Expose()
  @IsUndefinable()
  @IsEmail()
  @IsMaxLength(CustomerEntityConstraints.EMAIL_MAX_LENGTH)
  readonly email?: string;

  @Expose()
  @Type(() => NestedUpdateAddressDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: NestedUpdateAddressDto;
}
