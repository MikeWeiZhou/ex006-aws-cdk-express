import { IBaseModelDto } from '@ear/common/dtos';
import { IsMaxLength } from '@ear/common/validators';
import { AddressModelDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Company } from '../company.model';

/**
 * Company database model DTO.
 */
export class CompanyModelDto extends IBaseModelDto {
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
