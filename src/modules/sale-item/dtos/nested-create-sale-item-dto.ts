import { IDto, IsCurrencyAmount, IsResourceId } from '@ear/common';
import { Expose } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { SaleItemEntityConstraints } from '../sale-item-entity';

/**
 * Create SaleItem request parameters sanitized and validated to spec.
 *
 * Does not contain Sale ID. Only used for sanitization and validation when in a nested create
 * request of another entity.
 */
export class NestedCreateSaleItemDto implements IDto {
  @Expose()
  @IsInt()
  @Min(1)
  @Max(SaleItemEntityConstraints.QUANTITY_MAX_VALUE)
  readonly quantity!: number;

  @Expose()
  @IsCurrencyAmount(SaleItemEntityConstraints.PRICE_PER_UNIT_MAX_VALUE)
  readonly pricePerUnit!: number;

  @Expose()
  @IsCurrencyAmount(SaleItemEntityConstraints.TOTAL_MAX_VALUE)
  readonly total!: number;

  @Expose()
  @IsResourceId()
  readonly productId!: string;
}
