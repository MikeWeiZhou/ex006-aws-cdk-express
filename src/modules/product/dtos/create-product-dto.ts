import { IDto, IsCurrencyAmount, IsMaxLength, IsResourceId, IsUndefinableAndNullable } from '@ear/common';
import { Expose } from 'class-transformer';
import { ProductEntityConstraints } from '../product-entity';

/**
 * Create Product request parameters sanitized and validated to spec.
 */
export class CreateProductDto implements IDto {
  @Expose()
  @IsMaxLength(ProductEntityConstraints.NAME_MAX_LENGTH)
  readonly name!: string;

  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(ProductEntityConstraints.DESCRIPTION_MAX_LENGTH)
  readonly description?: string;

  @Expose()
  @IsMaxLength(ProductEntityConstraints.SKU_MAX_LENGTH)
  readonly sku!: string;

  @Expose()
  @IsCurrencyAmount(ProductEntityConstraints.PRICE_MAX_VALUE)
  readonly price!: number;

  @Expose()
  @IsResourceId()
  readonly companyId!: string;
}
