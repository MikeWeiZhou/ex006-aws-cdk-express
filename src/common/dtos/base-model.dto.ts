import { Expose } from 'class-transformer';
import {
  IsDate,
  Length,
} from 'class-validator';
import { IDto } from './i.dto';

/**
 * All models must have these fields.
 */
export class BaseModelDto implements IDto {
  @Expose()
  @Length(25, 25)
  readonly id!: string;

  @Expose()
  @IsDate()
  readonly createdAt!: Date;

  @Expose()
  @IsDate()
  readonly updatedAt!: Date;
}
