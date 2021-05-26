import { Expose } from 'class-transformer';
import { IDto } from './i-dto';

/**
 * Basic data for resource sent back to client as reponse.
 */
export abstract class IResponseBaseDto implements IDto {
  @Expose()
  readonly id!: string;
}
