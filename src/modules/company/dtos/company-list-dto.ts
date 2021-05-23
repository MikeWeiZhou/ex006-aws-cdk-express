import { IDto, IsMaxLength, IsUndefinable, ListOptionsDto } from '@ear/common';
import { AddressListDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Company } from '../company.model';

/**
 * Parameters for listing companies.
 */
export class CompanyListDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(Company.limits.NAME_MAX_LENGTH)
  readonly name?: string;

  @Expose()
  @IsUndefinable()
  @IsEmail()
  @IsMaxLength(Company.limits.EMAIL_MAX_LENGTH)
  readonly email?: string;

  @Expose()
  @Type(() => AddressListDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly address?: AddressListDto;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}