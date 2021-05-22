import { IBaseModelDto } from '@ear/common/dtos';
import { IsResourceId } from '@ear/common/validators';
import { AddressModelDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, Length, ValidateNested } from 'class-validator';

/**
 * Customer database model DTO.
 */
export class CustomerModelDto extends IBaseModelDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => AddressModelDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressModelDto;

  @Expose()
  @Length(1, 50)
  readonly firstName!: string;

  @Expose()
  @Length(1, 50)
  readonly lastName!: string;

  @Expose()
  @IsEmail()
  @Length(1, 100)
  readonly email!: string;
}
