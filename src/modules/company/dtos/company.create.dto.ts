import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';

/**
 * Parameters required for creating a Company.
 */
export class CompanyCreateDto implements IDto {
  @Expose()
  @IsNotEmpty()
  @Length(2, 50)
  readonly name!: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 100)
  readonly email!: string;

  @Expose()
  @IsNotEmpty()
  @Length(5, 100)
  readonly streetAddress!: string;

  @Expose()
  @IsNotEmpty()
  @Length(2, 100)
  readonly city!: string;

  @Expose()
  @IsNotEmpty()
  @Length(2, 100)
  readonly state!: string;

  @Expose()
  @IsNotEmpty()
  @Length(2, 100)
  readonly country!: string;
}
