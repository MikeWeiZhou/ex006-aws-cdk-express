import { IResponseBaseDto } from '@ear/common';
import { NestedAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';

/**
 * Company data sanitized to spec and sent back to client as response.
 */
export class CustomerDto extends IResponseBaseDto {
  @Expose()
  readonly firstName!: string;

  @Expose()
  readonly lastName!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly companyId!: string;

  @Expose()
  @Type(() => NestedAddressDto)
  readonly address!: NestedAddressDto;
}
