import { IDto, ListOptionsDto } from '@ear/common/dtos';
import { Currency } from '@ear/common/enums';
import { IsCurrencyAmount, IsCurrencyCode, IsResourceId } from '@ear/common/validators';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, Length, ValidateNested } from 'class-validator';

/**
 * Parameters for listing products.
 */
export class ProductListDto implements IDto {
  @Expose()
  @IsOptional()
  @IsResourceId()
  readonly companyId?: string;

  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly name?: string;

  @Expose()
  @IsOptional()
  @Length(1, 255)
  readonly description?: string;

  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly sku?: string;

  @Expose()
  @IsOptional()
  @IsCurrencyAmount()
  readonly price?: number;

  @Expose()
  @IsOptional()
  @IsCurrencyCode()
  readonly currency?: Currency;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
