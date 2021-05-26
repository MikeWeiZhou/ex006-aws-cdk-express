import { IDto, IsCurrencyAmount, IsMaxLength, IsResourceId, IsUndefinable, IsUndefinableAndNullable, ListOptionsDto } from '@ear/common';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { ProductEntityConstraints } from '../product-entity';

/**
 * List Product request parameters sanitized and validated to spec.
 */
export class ListProductDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsMaxLength(ProductEntityConstraints.NAME_MAX_LENGTH)
  readonly name?: string;

  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(ProductEntityConstraints.DESCRIPTION_MAX_LENGTH)
  readonly description?: string;

  @Expose()
  @IsUndefinable()
  @IsMaxLength(ProductEntityConstraints.SKU_MAX_LENGTH)
  readonly sku?: string;

  @Expose()
  @IsUndefinable()
  @IsCurrencyAmount(ProductEntityConstraints.PRICE_MAX_VALUE)
  readonly price?: number;

  @Expose()
  @IsUndefinable()
  @IsResourceId()
  readonly companyId?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
