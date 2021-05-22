import { IBaseModelDto } from '@ear/common/dtos';
import { Currency } from '@ear/common/enums';
import { IsCurrencyAmount, IsCurrencyCode, IsMaxLength, IsResourceId, IsUndefinableAndNullable } from '@ear/common/validators';
import { Expose } from 'class-transformer';
import { Product } from '../product.model';

/**
 * Product database model DTO.
 */
export class ProductModelDto extends IBaseModelDto {
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
  readonly currency!: Currency;
}
