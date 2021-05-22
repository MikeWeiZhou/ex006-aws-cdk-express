import { IBaseModelDto } from '@ear/common/dtos';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

/**
 * Address database model DTO.
 */
export class AddressModelDto extends IBaseModelDto {
  @Expose()
  @Length(1, 150)
  readonly address!: string;

  @Expose()
  @Length(1, 10)
  readonly postcode!: string;

  @Expose()
  @Length(1, 100)
  readonly city!: string;

  @Expose()
  @Length(1, 100)
  readonly province!: string;

  @Expose()
  @Length(1, 100)
  readonly country!: string;
}
