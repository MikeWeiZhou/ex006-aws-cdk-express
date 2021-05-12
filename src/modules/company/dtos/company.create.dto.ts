import { Exclude, Expose } from 'class-transformer';
import { Dto } from '../../../common/dto';

/**
 * Company database model.
 */
@Exclude()
export class CompanyCreateDto implements Dto {
  @Expose()
  name!: string;

  @Expose()
  address!: string;

  @Expose()
  email!: string;
}
