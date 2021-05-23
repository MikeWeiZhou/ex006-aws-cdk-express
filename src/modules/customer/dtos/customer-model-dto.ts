import { IModelDto, IsMaxLength, IsResourceId } from '@ear/common';
import { AddressModelDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Customer } from '../customer.model';

/**
 * Customer database model DTO.
 */
export class CustomerModelDto extends IModelDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => AddressModelDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressModelDto;

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
