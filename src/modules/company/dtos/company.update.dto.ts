import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { IdDto } from '../../../common/dtos/id.dto';

/**
 * Parameters for updating a Company.
 */
export class CompanyUpdateDto extends IdDto {
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
}
