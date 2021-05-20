import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, Length, ValidateNested } from 'class-validator';
import { IdDto } from '../../../common/dtos/id.dto';
import { AddressUpdateDto } from '../../address/dtos';

/**
 * Parameters for updating a Company.
 */
export class CompanyUpdateDto extends IdDto {
  @Expose()
  @Type(() => AddressUpdateDto)
  @IsOptional()
  @ValidateNested()
  readonly address?: AddressUpdateDto;

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
