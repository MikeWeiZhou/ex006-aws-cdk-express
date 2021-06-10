import { IDto } from '@ear/common';

/**
 * Create SaleItem request, used only internally within services.
 */
export interface ICreateSaleItemDto extends IDto {
  readonly quantity: number;
  readonly pricePerUnit: number;
  readonly total: number;
  readonly saleId: string;
  readonly productId: string;
}
