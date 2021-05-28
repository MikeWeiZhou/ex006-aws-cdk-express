import { IDto, IsResourceId } from '@ear/common';
import { Expose } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

/**
 * Create SaleItem request parameters sanitized and validated to spec.
 *
 * Does not contain Sale ID. Only used for sanitization and validation when in a nested create
 * request of another entity.
 */
export class NestedCreateSaleItemDto implements IDto {
  @Expose()
  @IsPositive()
  @IsInt()
  readonly quantity!: number;

  @Expose()
  @IsPositive()
  @IsInt()
  readonly pricePerUnit!: number;

  @Expose()
  @IsPositive()
  @IsInt()
  readonly total!: number;

  @Expose()
  @IsResourceId()
  readonly productId!: string;
}
