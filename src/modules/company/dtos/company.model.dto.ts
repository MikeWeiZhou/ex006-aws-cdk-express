import { IBaseModelDto } from '@ear/common/dtos';
import { AddressModelDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, Length, ValidateNested } from 'class-validator';

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
  @Length(1, 50)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @Length(1, 100)
  readonly email!: string;
}
