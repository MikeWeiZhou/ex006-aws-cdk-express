import { Expose, Type } from 'class-transformer';
import { IsEmail, Length, ValidateNested } from 'class-validator';
import { IBaseModelDto } from '../../../common/dtos';
import { AddressModelDto } from '../../address/dtos';

/**
 * Company database model DTO.
 */
export class CompanyModelDto extends IBaseModelDto {
  @Expose()
  @Type(() => AddressModelDto)
  @ValidateNested()
  readonly address!: AddressModelDto;

  @Expose()
  @Length(2, 50)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @Length(5, 100)
  readonly email!: string;
}
