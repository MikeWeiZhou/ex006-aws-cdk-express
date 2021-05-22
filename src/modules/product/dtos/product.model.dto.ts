import { IBaseModelDto } from '@ear/common/dtos';
import { Currency } from '@ear/common/enums';
import { IsCurrencyAmount, IsCurrencyCode, IsResourceId } from '@ear/common/validators';
import { Expose } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';

/**
 * Product database model DTO.
 */
export class ProductModelDto extends IBaseModelDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Length(1, 100)
  readonly name!: string;

  @Expose()
  @IsOptional()
  @Length(1, 255)
  readonly description?: string;

  @Expose()
  @Length(1, 100)
  readonly sku!: string;

  @Expose()
  @IsCurrencyAmount()
  readonly price!: number;

  @Expose()
  @IsCurrencyCode()
  readonly currency!: Currency;
}
