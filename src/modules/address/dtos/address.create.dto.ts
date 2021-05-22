import { IDto } from '@ear/common/dtos';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

/**
 * Parameters required for creating an Address.
 */
export class AddressCreateDto implements IDto {
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
