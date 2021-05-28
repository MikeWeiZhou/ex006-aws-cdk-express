import { IResponseBaseDto } from '@ear/common';
import { NestedSaleItemDto } from '@ear/modules/sale-item';
import { Expose, Type } from 'class-transformer';
import { SaleStatusCode } from '../types/sale-status-code';

/**
 * Sale data sanitized to spec and sent back to client as response.
 */
export class SaleDto extends IResponseBaseDto {
  @Expose()
  readonly statusCode!: SaleStatusCode;

  @Expose()
  readonly total!: number;

  @Expose()
  readonly comments?: string;

  @Expose()
  readonly companyId!: string;

  @Expose()
  readonly customerId!: string;

  @Expose()
  @Type(() => NestedSaleItemDto)
  readonly saleItems!: NestedSaleItemDto[];
}
