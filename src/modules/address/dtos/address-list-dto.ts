import { IDto, IsMaxLength, IsUndefinable, ListOptionsDto } from '@ear/common';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { Address } from '../address.model';

/**
 * Parameters for listing addresses.
 */
export class AddressListDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(Address.limits.ADDRESS_MAX_LENGTH)
  readonly address?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Address.limits.POSTCODE_MAX_LENGTH)
  readonly postcode?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Address.limits.CITY_MAX_LENGTH)
  readonly city?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Address.limits.PROVINCE_MAX_LENGTH)
  readonly province?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Address.limits.COUNTRY_MAX_LENGTH)
  readonly country?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
