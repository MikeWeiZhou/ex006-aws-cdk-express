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
  @Length(2, 50)
  readonly name?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(5, 100)
  readonly email?: string;

  @Expose()
  @IsOptional()
  @Length(5, 100)
  readonly streetAddress?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly city?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly state?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly country?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
