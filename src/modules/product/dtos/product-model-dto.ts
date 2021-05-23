import { CurrencyCode, IModelDto, IsCurrencyAmount, IsCurrencyCode, IsMaxLength, IsResourceId, IsUndefinableAndNullable } from '@ear/common';
import { Expose } from 'class-transformer';
import { Product } from '../product.model';

/**
 * Product database model DTO.
 */
export class ProductModelDto extends IModelDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @IsMaxLength(Product.limits.NAME_MAX_LENGTH)
  readonly name!: string;

  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(Product.limits.DESCRIPTION_MAX_LENGTH)
  readonly description?: string;

  @Expose()
  @IsMaxLength(Product.limits.SKU_MAX_LENGTH)
  readonly sku!: string;

  @Expose()
  @IsCurrencyAmount(Product.limits.PRICE_MAX_VALUE)
  readonly price!: number;

  @Expose()
  @IsCurrencyCode()
  readonly currency!: CurrencyCode;
}
