import { Expose } from 'class-transformer';
import { Length } from 'class-validator';
import { IBaseModelDto } from '../../../common/dtos';

/**
 * Address database model DTO.
 */
export class AddressModelDto extends IBaseModelDto {
  @Expose()
  @Length(5, 150)
  readonly address!: string;

  @Expose()
  @Length(5, 10)
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
