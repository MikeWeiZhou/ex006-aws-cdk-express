import { IDto, IsResourceId } from '@ear/common';
import { Expose } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

/**
 * Create SaleItem request parameters sanitized and validated to spec.
 */
export class CreateSaleItemDto implements IDto {
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
  readonly saleId!: string;

  @Expose()
  @IsResourceId()
  readonly productId!: string;
}
