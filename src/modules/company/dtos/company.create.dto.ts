import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';

/**
 * Parameters required for creating a Company.
 */
export class CompanyCreateDto implements IDto {
  @Expose()
  @IsNotEmpty()
  @Length(3, 255)
  name!: string;

  @Expose()
  @IsNotEmpty()
  @Length(3, 255)
  address!: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
