import { IDto } from '@ear/common';
import { Product } from '@ear/modules/product';
import { Expose } from 'class-transformer';

/**
 * SaleItem data sanitized to spec and sent back to client as response.
 *
 * Does not contain Sale ID. Only used for sanitization when in a nested response of another entity.
 */
export class NestedSaleItemDto implements IDto {
  @Expose()
  readonly quantity!: number;

  @Expose()
  readonly pricePerUnit!: number;

  @Expose()
  readonly total!: number;

  @Expose()
  readonly product!: Product;

  @Expose()
  readonly productId!: string;
}
