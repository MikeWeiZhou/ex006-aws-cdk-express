import { IResponseBaseDto } from '@ear/common';
import { Expose } from 'class-transformer';

/**
 * Product data sanitized to spec and sent back to client as response.
 */
export class ProductDto extends IResponseBaseDto {
  @Expose()
  readonly name!: string;

  @Expose()
  readonly description?: string;

  @Expose()
  readonly sku!: string;

  @Expose()
  readonly price!: number;

  @Expose()
  readonly companyId!: string;
}
