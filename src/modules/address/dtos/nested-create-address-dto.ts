import { IDto, IsMaxLength } from '@ear/common';
import { Expose } from 'class-transformer';
import { AddressEntityConstraints } from '../address-entity';

/**
 * Create Address request parameters sanitized and validated to spec.
 *
 * Only used for sanitization and validation when in a nested create request of another entity.
 */
export class NestedCreateAddressDto implements IDto {
  @Expose()
  @IsMaxLength(AddressEntityConstraints.LINE1_MAX_LENGTH)
  readonly line1!: string;

  @Expose()
  @IsMaxLength(AddressEntityConstraints.POSTCODE_MAX_LENGTH)
  readonly postcode!: string;

  @Expose()
  @IsMaxLength(AddressEntityConstraints.CITY_MAX_LENGTH)
  readonly city!: string;

  @Expose()
  @IsMaxLength(AddressEntityConstraints.PROVINCE_MAX_LENGTH)
  readonly province!: string;

  @Expose()
  @IsMaxLength(AddressEntityConstraints.COUNTRY_MAX_LENGTH)
  readonly country!: string;
}
