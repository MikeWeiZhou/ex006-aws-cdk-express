import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, Length, ValidateNested } from 'class-validator';
import { IDto, ListOptionsDto } from '../../../common/dtos';
import { IsResourceId } from '../../../common/validators';
import { AddressListDto } from '../../address/dtos';

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
  @Length(2, 50)
  readonly firstName?: string;

  @Expose()
  @IsOptional()
  @Length(2, 50)
  readonly lastName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(5, 100)
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
