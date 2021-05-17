import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { IDto } from './i.dto';

/**
 * DTO containing only resource ID.
 */
export class IdDto implements IDto {
  /**
   * Resource ID.
   */
  @Expose()
  @IsUUID()
  id!: string;
}
