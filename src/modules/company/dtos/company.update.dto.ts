import { IdDto } from '@ear/common/dtos';
import { AddressNestedUpdateDto } from '@ear/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, Length, ValidateNested } from 'class-validator';

/**
 * Parameters for updating a Company.
 */
export class CompanyUpdateDto extends IdDto {
  @Expose()
  @Type(() => AddressNestedUpdateDto)
  @IsOptional()
  @ValidateNested()
  readonly address?: AddressNestedUpdateDto;

  @Expose()
  @IsOptional()
  @Length(1, 50)
  readonly name?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  readonly email?: string;
}
