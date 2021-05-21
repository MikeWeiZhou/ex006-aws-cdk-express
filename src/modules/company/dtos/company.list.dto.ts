import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, Length, ValidateNested } from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';
import { ListOptionsDto } from '../../../common/dtos/list-options.dto';
import { AddressListDto } from '../../address/dtos';

/**
 * Parameters for listing companies.
 */
export class CompanyListDto implements IDto {
  @Expose()
  @IsOptional()
  @Length(2, 50)
  readonly name?: string;

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
