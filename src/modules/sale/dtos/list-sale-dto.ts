import { IDto, IsMaxLength, IsResourceId, IsUndefinable, IsUndefinableAndNullable, ListOptionsDto } from '@ear/common';
import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { SaleEntityConstraints } from '../sale-entity';
import { IsSaleStatusCode } from '../validators/is-sale-status-code';

/**
 * List Sale request parameters sanitized and validated to spec.
 */
export class ListSaleDto implements IDto {
  @Expose()
  @IsUndefinable()
  @IsSaleStatusCode()
  readonly statusCode?: string;

  @Expose()
  @IsUndefinableAndNullable()
  @IsMaxLength(SaleEntityConstraints.COMMENTS_MAX_LENGTH)
  readonly comments?: string;

  @Expose()
  @IsUndefinable()
  @IsResourceId()
  readonly companyId?: string;

  @Expose()
  @IsUndefinable()
  @IsResourceId()
  readonly customerId?: string;

  @Expose()
  @Type(() => ListOptionsDto)
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  readonly options?: ListOptionsDto;
}
