import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, Length, ValidateNested } from 'class-validator';
import { IDto, ListOptionsDto } from '../../../common/dtos';

/**
 * Parameters for listing addresses.
 */
export class AddressListDto implements IDto {
  @Expose()
  @IsOptional()
  @Length(5, 150)
  readonly address?: string;

  @Expose()
  @IsOptional()
  @Length(5, 10)
  readonly postcode?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly city?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly province?: string;

  @Expose()
  @IsOptional()
  @Length(2, 100)
  readonly country?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
