import { Expose } from 'class-transformer';
import { Length } from 'class-validator';
import { IDto } from '../../../common/dtos/i.dto';

/**
 * Parameters required for creating an Address.
 */
export class AddressCreateDto implements IDto {
  @Expose()
  @Length(5, 150)
  readonly address!: string;

  @Expose()
  @Length(2, 10)
  readonly postcode!: string;

  @Expose()
  @Length(2, 100)
  readonly city!: string;

  @Expose()
  @Length(2, 100)
  readonly province!: string;

  @Expose()
  @Length(2, 100)
  readonly country!: string;
}
