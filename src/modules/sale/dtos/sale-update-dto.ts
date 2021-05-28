import { IsMaxLength, IsUndefinableAndNullable, RequestIdDto } from '@ear/common';
import { Expose } from 'class-transformer';
import { SaleEntityConstraints } from '../sale-entity';

/**
 * Parameters required for updating a Sale.
 */
export class UpdateSaleDto extends RequestIdDto {
  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(SaleEntityConstraints.COMMENTS_MAX_LENGTH)
  readonly comments?: string;
}
