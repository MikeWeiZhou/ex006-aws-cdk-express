import { IDto, ListOptionsDto } from '@ear/common/dtos';
import { IsResourceId } from '@ear/common/validators';
import { AddressListDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, Length, ValidateNested } from 'class-validator';

/**
 * Parameters for listing customers.
 */
export class CustomerListDto implements IDto {
  @Expose()
  @IsOptional()
  @IsResourceId()
  readonly companyId?: string;

  @Expose()
  @IsOptional()
  @Length(1, 50)
  readonly firstName?: string;

  @Expose()
  @IsOptional()
  @Length(1, 50)
  readonly lastName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  readonly email?: string;

  @Expose()
  @Type(() => AddressListDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly address?: AddressListDto;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
