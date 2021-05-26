import { IDto, IsMaxLength, IsResourceId } from '@ear/common';
import { NestedCreateAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { CustomerEntityConstraints } from '../customer-entity';

/**
 * Create Customer request parameters sanitized and validated to spec.
 */
export class CreateCustomerDto implements IDto {
  @Expose()
  @IsMaxLength(CustomerEntityConstraints.FIRST_NAME_MAX_LENGTH)
  readonly firstName!: string;

  @Expose()
  @IsMaxLength(CustomerEntityConstraints.LAST_NAME_MAX_LENGTH)
  readonly lastName!: string;

  @Expose()
  @IsEmail()
  @IsMaxLength(CustomerEntityConstraints.EMAIL_MAX_LENGTH)
  readonly email!: string;

  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => NestedCreateAddressDto)
  @IsObject()
  @ValidateNested()
  readonly address!: NestedCreateAddressDto;
}
