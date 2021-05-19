import { Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { BaseModelDto } from '../../../common/dtos';

/**
 * Customer database model DTO.
 */
export class CustomerModelDto extends BaseModelDto {
  @Expose()
  @Length(25, 25)
  readonly companyId!: string;

  @Expose()
  @Length(2, 50)
  readonly firstName!: string;

  @Expose()
  @Length(2, 50)
  readonly lastName!: string;

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
