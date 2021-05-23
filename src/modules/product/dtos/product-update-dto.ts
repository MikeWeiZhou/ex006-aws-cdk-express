import { CurrencyCode, IdDto, IsCurrencyAmount, IsCurrencyCode, IsMaxLength, IsUndefinable, IsUndefinableAndNullable } from '@ear/common';
import { Expose } from 'class-transformer';
import { Product } from '../product.model';

/**
 * Parameters required for updating a Product.
 */
export class ProductUpdateDto extends IdDto {
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
}
