import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';
import { ListOptionsDto } from '../../../common/dtos/list-options.dto';

/**
 * Parameters for listing companies.
 */
export class CompanyListDto implements IDto {
  @Expose()
  @IsOptional()
  @Length(3, 255)
  name?: string;

  @Expose()
  @IsOptional()
  @Length(3, 255)
  address?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @ValidateNested()
  options?: ListOptionsDto;
}
