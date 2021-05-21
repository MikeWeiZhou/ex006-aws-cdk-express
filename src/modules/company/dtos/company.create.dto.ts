import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, Length, ValidateNested } from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';
import { AddressCreateDto } from '../../address/dtos';

/**
 * Parameters required for creating a Company.
 */
export class CompanyCreateDto implements IDto {
  @Expose()
  @Type(() => AddressCreateDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressCreateDto;

  @Expose()
  @Length(2, 50)
  readonly name!: string;

  @Expose()
  @IsEmail()
  @Length(5, 100)
  readonly email!: string;
}
