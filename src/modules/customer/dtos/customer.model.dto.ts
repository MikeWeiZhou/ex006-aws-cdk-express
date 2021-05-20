import { Expose, Type } from 'class-transformer';
import { IsEmail, Length, ValidateNested } from 'class-validator';
import { IBaseModelDto } from '../../../common/dtos';
import { IsResourceId } from '../../../common/validators';
import { AddressModelDto } from '../../address/dtos';

/**
 * Customer database model DTO.
 */
export class CustomerModelDto extends IBaseModelDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => AddressModelDto)
  @ValidateNested()
  readonly address!: AddressModelDto;

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
}
