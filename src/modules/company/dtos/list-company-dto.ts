import { IDto, IsMaxLength, IsUndefinable, ListOptionsDto } from '@ear/common';
import { NestedListAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CompanyEntityConstraints } from '../company-entity';

/**
 * List Company request parameters sanitized and validated to spec.
 */
export class ListCompanyDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(CompanyEntityConstraints.NAME_MAX_LENGTH)
  readonly name?: string;

  @Expose()
  @Type(() => NestedListAddressDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: NestedListAddressDto;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
