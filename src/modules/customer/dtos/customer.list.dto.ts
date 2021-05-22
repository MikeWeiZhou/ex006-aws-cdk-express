import { IDto, ListOptionsDto } from '@ear/common/dtos';
import { IsMaxLength, IsResourceId, IsUndefinable } from '@ear/common/validators';
import { AddressListDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Customer } from '../customer.model';

/**
 * Parameters for listing customers.
 */
export class CustomerListDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsResourceId()
  readonly companyId?: string;

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

  @Expose()
  @Type(() => AddressListDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: AddressListDto;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
