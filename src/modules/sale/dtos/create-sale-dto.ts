import { IDto, IsMaxLength, IsResourceId, IsUndefinableAndNullable } from '@ear/common';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { NestedCreateSaleItemDto } from '../../sale-item/dtos/nested-create-sale-item-dto';
import { SaleEntityConstraints } from '../sale-entity';

/**
 * Create Sale request parameters sanitized and validated to spec.
 */
export class CreateSaleDto implements IDto {
  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(SaleEntityConstraints.COMMENTS_MAX_LENGTH)
  readonly comments?: string;

  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @IsResourceId()
  readonly customerId!: string;

  @Expose()
  @Type(() => NestedCreateSaleItemDto)
  @ArrayNotEmpty()
  @ValidateNested()
  readonly saleItems!: NestedCreateSaleItemDto[];
}
