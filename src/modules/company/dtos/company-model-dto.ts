import { IModelDto, IsMaxLength } from '@ear/common';
import { AddressModelDto } from '@ear/modules/address';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Company } from '../company.model';

/**
 * Company database model DTO.
 */
export class CompanyModelDto extends IModelDto {
  @Expose()
  @Type(() => AddressModelDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressModelDto;

  @Expose()
  @IsMaxLength(Company.limits.NAME_MAX_LENGTH)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @IsMaxLength(Company.limits.EMAIL_MAX_LENGTH)
  readonly email!: string;
}
