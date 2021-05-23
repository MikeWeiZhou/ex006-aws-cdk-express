import { CurrencyCode, IDto, IsCurrencyAmount, IsCurrencyCode, IsMaxLength, IsResourceId, IsUndefinable, IsUndefinableAndNullable, ListOptionsDto } from '@ear/common';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { Product } from '../product.model';

/**
 * Parameters for listing products.
 */
export class ProductListDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsResourceId()
  readonly companyId?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Product.limits.NAME_MAX_LENGTH)
  readonly name?: string;

  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(Product.limits.DESCRIPTION_MAX_LENGTH)
  readonly description?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(Product.limits.SKU_MAX_LENGTH)
  readonly sku?: string;

  @Expose()
  @IsUndefinable()
  @IsCurrencyAmount(Product.limits.PRICE_MAX_VALUE)
  readonly price?: number;

  @Expose()
  @IsUndefinable()
  @IsCurrencyCode()
  readonly currency?: CurrencyCode;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
