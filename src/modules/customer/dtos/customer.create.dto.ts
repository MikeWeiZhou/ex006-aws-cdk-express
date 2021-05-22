import { IDto } from '@ear/common/dtos';
import { IsResourceId } from '@ear/common/validators';
import { AddressCreateDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, Length, ValidateNested } from 'class-validator';

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
  @Length(1, 50)
  readonly firstName!: string;

  @Expose()
  @Length(1, 50)
  readonly lastName!: string;

  @Expose()
  @IsEmail()
  @Length(1, 100)
  readonly email!: string;
}
