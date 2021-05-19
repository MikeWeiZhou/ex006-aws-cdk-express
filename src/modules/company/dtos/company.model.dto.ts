import { Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { BaseModelDto } from '../../../common/dtos';

/**
 * Company database model DTO.
 */
export class CompanyModelDto extends BaseModelDto {
  @Expose()
  @Length(2, 50)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @Length(5, 100)
  readonly email!: string;

  @Expose()
  @Length(5, 100)
  readonly streetAddress!: string;

  @Expose()
  @Length(2, 100)
  readonly city!: string;

  @Expose()
  @Length(2, 100)
  readonly state!: string;

  @Expose()
  @Length(2, 100)
  readonly country!: string;
}