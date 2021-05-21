import { Expose, Type } from 'class-transformer';
import { IsEmail, IsObject, Length, ValidateNested } from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';
import { IsResourceId } from '../../../common/validators';
import { AddressCreateDto } from '../../address/dtos';

/**
 * Parameters required for creating a Customer.
 */
export class CustomerCreateDto implements IDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => AddressCreateDto)
  @IsObject()
  @ValidateNested()
  readonly address!: AddressCreateDto;

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
