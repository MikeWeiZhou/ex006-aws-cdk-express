import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { IdDto } from '../../../common/dtos/id.dto';

/**
 * Parameters for updating a Company.
 */
export class CompanyUpdateDto extends IdDto {
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
}
