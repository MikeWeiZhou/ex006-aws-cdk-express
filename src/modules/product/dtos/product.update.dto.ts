import { IdDto } from '@ear/common/dtos';
import { Currency } from '@ear/common/enums';
import { IsCurrencyAmount, IsCurrencyCode } from '@ear/common/validators';
import { Expose } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';

/**
 * Parameters required for updating a Product.
 */
export class ProductUpdateDto extends IdDto {
  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly name?: string;

  @Expose()
  @IsOptional()
  @Length(1, 255)
  readonly description?: string;

  @Expose()
  @IsOptional()
  @Length(1, 100)
  readonly sku?: string;

  @Expose()
  @IsOptional()
  @IsCurrencyAmount()
  readonly price?: number;

  @Expose()
  @IsOptional()
  @IsCurrencyCode()
  readonly currency?: Currency;
}
