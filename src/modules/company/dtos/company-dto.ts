import { IResponseBaseDto } from '@ear/common';
import { NestedAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';

/**
 * Company data sanitized to spec and sent back to client as response.
 */
export class CompanyDto extends IResponseBaseDto {
  @Expose()
  readonly name!: string;

  @Expose()
  @Type(() => NestedAddressDto)
  readonly address!: NestedAddressDto;
}
