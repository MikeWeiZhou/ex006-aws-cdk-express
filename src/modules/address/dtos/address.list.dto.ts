import { IDto, ListOptionsDto } from '@ear/common/dtos';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, Length, ValidateNested } from 'class-validator';

/**
 * Parameters for listing addresses.
 */
export class AddressListDto implements IDto {
  @Expose()
  @IsOptional()
  @Length(1, 150)
  readonly address?: string;

  @Expose()
  @IsOptional()
  @Length(1, 10)
  readonly postcode?: string;

  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly city?: string;

  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly province?: string;

  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly country?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
