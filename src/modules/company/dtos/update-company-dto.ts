import { IsMaxLength, IsUndefinable, RequestIdDto } from '@ear/common';
import { NestedUpdateAddressDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { CompanyEntityConstraints } from '../company-entity';

/**
 * Update Company request parameters sanitized and validated to spec.
 */
export class UpdateCompanyDto extends RequestIdDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(CompanyEntityConstraints.NAME_MAX_LENGTH)
  readonly name?: string;

  @Expose()
  @IsUndefinable()
  @IsEmail()
  @IsMaxLength(CompanyEntityConstraints.EMAIL_MAX_LENGTH)
  readonly email?: string;

  @Expose()
  @Type(() => NestedUpdateAddressDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: NestedUpdateAddressDto;
}
