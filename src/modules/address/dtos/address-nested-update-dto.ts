import { IDto, IsMaxLength } from '@ear/common';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Address } from '../address.model';

/**
 * Parameters updating an Address that is nested into another model.
 */
export class AddressNestedUpdateDto implements IDto {
  @Expose()
  @IsOptional()
  @IsMaxLength(Address.limits.ADDRESS_MAX_LENGTH)
  readonly address?: string;

  @Expose()
  @IsOptional()
  @IsMaxLength(Address.limits.POSTCODE_MAX_LENGTH)
  readonly postcode?: string;

  @Expose()
  @IsOptional()
  @IsMaxLength(Address.limits.CITY_MAX_LENGTH)
  readonly city?: string;

  @Expose()
  @IsOptional()
  @IsMaxLength(Address.limits.PROVINCE_MAX_LENGTH)
  readonly province?: string;

  @Expose()
  @IsOptional()
  @IsMaxLength(Address.limits.COUNTRY_MAX_LENGTH)
  readonly country?: string;
}