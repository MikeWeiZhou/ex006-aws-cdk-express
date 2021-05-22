import { IDto } from '@ear/common/dtos';
import { AddressCreateDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, Length, ValidateNested } from 'class-validator';

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
  @Length(1, 50)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @Length(1, 100)
  readonly email!: string;
}
