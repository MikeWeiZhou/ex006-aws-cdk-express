import { IDto, IsMaxLength, IsUndefinable } from '@ear/common';
import { Expose } from 'class-transformer';
import { AddressEntityConstraints } from '../address-entity';

/**
 * Update Address request parameters sanitized and validated to spec.
 *
 * Does not contain resource ID. Only used for sanitization and validation when in a nested update
 * request of another entity.
 *
 * Updating Company for example:
 *    {
 *      "name": "Company Name",
 *      "address": {
 *        "line1": "123 Radiant Road",
 *        "postcode": "V5I2M2",
 *        ...
 *      }
 *    }
 */
export class NestedUpdateAddressDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(AddressEntityConstraints.LINE1_MAX_LENGTH)
  readonly line1?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(AddressEntityConstraints.POSTCODE_MAX_LENGTH)
  readonly postcode?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(AddressEntityConstraints.CITY_MAX_LENGTH)
  readonly city?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(AddressEntityConstraints.PROVINCE_MAX_LENGTH)
  readonly province?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(AddressEntityConstraints.COUNTRY_MAX_LENGTH)
  readonly country?: string;
}
