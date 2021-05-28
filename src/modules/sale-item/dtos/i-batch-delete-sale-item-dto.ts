import { IDto } from '@ear/common';

/**
 * Batch delete SaleItems request, used only internally within services.
 */
export interface IBatchDeleteSaleItemDto extends IDto {
  readonly saleId: string;
}
