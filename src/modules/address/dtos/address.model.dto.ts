import { IBaseModelDto } from '@ear/common/dtos';
import { IsMaxLength } from '@ear/common/validators';
import { Expose } from 'class-transformer';
import { Address } from '../address.model';

/**
 * Address database model DTO.
 */
export class AddressModelDto extends IBaseModelDto {
  @Expose()
  @IsMaxLength(Address.limits.ADDRESS_MAX_LENGTH)
  readonly address!: string;

  @Expose()
  @IsMaxLength(Address.limits.POSTCODE_MAX_LENGTH)
  readonly postcode!: string;

  @Expose()
  @IsMaxLength(Address.limits.CITY_MAX_LENGTH)
  readonly city!: string;

  @Expose()
  @IsMaxLength(Address.limits.PROVINCE_MAX_LENGTH)
  readonly province!: string;

  @Expose()
  @IsMaxLength(Address.limits.COUNTRY_MAX_LENGTH)
  readonly country!: string;
}
