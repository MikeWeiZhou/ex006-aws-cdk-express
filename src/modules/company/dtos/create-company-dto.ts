import { IDto, IsMaxLength } from '@ear/common';
import { NestedCreateAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CompanyEntityConstraints } from '../company-entity';

/**
 * Create Company request parameters sanitized and validated to spec.
 */
export class CreateCompanyDto implements IDto {
  @Expose()
  @Type(() => NestedCreateAddressDto)
  @IsObject()
  @ValidateNested()
  readonly address!: NestedCreateAddressDto;

  @Expose()
  @IsMaxLength(CompanyEntityConstraints.NAME_MAX_LENGTH)
  readonly name!: string;
}
