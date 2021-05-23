import { IDto, IsMaxLength } from '@ear/common';
import { AddressCreateDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Company } from '../company.model';

/**
 * Parameters required for creating a Company.
 */
export class CompanyCreateDto implements IDto {
  @Expose()
  @Type(() => AddressCreateDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressCreateDto;

  @Expose()
  @IsMaxLength(Company.limits.NAME_MAX_LENGTH)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @IsMaxLength(Company.limits.EMAIL_MAX_LENGTH)
  readonly email!: string;
}