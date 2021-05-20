import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, Length, ValidateNested } from 'class-validator';
import { IdDto } from '../../../common/dtos/id.dto';
import { AddressNestedUpdateDto } from '../../address/dtos';

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
  @Length(2, 50)
  readonly name?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(5, 100)
  readonly email?: string;
}
