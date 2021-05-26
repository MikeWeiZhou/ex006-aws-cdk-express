import { IsCurrencyAmount, IsMaxLength, IsUndefinable, IsUndefinableAndNullable, RequestIdDto } from '@ear/common';
import { Expose } from 'class-transformer';
import { ProductEntityConstraints } from '../product-entity';

/**
 * Update Company request parameters sanitized and validated to spec.
 */
export class UpdateProductDto extends RequestIdDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(ProductEntityConstraints.NAME_MAX_LENGTH)
  readonly name?: string;

  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(ProductEntityConstraints.DESCRIPTION_MAX_LENGTH)
  readonly description?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(ProductEntityConstraints.SKU_MAX_LENGTH)
  readonly sku?: string;

  @Expose()
  @IsUndefinable()
  @IsCurrencyAmount(ProductEntityConstraints.PRICE_MAX_VALUE)
  readonly price?: number;
}
