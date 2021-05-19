import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, Length, ValidateNested } from 'class-validator';
import { IDto, ListOptionsDto } from '../../../common/dtos';

/**
 * Parameters required for updating a Customer.
 */
export class CustomerListDto implements IDto {
  @Expose()
  @Length(25, 25)
  readonly companyId!: string;

  @Expose()
  @IsOptional()
  @Length(2, 50)
  readonly firstName?: string;

  @Expose()
  @IsOptional()
  @Length(2, 50)
  readonly lastName?: string;

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

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
