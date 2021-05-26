import { IDto, IsMaxLength, IsResourceId, IsUndefinable, ListOptionsDto } from '@ear/common';
import { NestedListAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { CustomerEntityConstraints } from '../customer-entity';

/**
 * List Customer request parameters sanitized and validated to spec.
 */
export class ListCustomerDto implements IDto {
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
  @IsUndefinable()
  @IsResourceId()
  readonly companyId?: string;

  @Expose()
  @Type(() => NestedListAddressDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: NestedListAddressDto;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
