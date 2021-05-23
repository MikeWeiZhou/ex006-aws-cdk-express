import { IDto, IsMaxLength, IsResourceId } from '@ear/common';
import { AddressCreateDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Customer } from '../customer.model';

/**
 * Parameters required for creating a Customer.
 */
export class CustomerCreateDto implements IDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => AddressCreateDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressCreateDto;

  @Expose()
  @IsMaxLength(Customer.limits.FIRST_NAME_MAX_LENGTH)
  readonly firstName!: string;

  @Expose()
  @IsMaxLength(Customer.limits.LAST_NAME_MAX_LENGTH)
  readonly lastName!: string;

  @Expose()
  @IsEmail()
  @IsMaxLength(Customer.limits.EMAIL_MAX_LENGTH)
  readonly email!: string;
}
