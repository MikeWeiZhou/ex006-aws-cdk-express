import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/models/base.model';
// eslint-disable-next-line import/no-cycle
import { Customer } from '../customer/customer.model';

/**
 * Company model.
 */
@Entity()
@Index('idx_company_unique_email', ['email'], { unique: true })
export class Company extends BaseModel {
  /**
   * Customers that belong to this Company.
   */
  @OneToMany('Customer', 'company')
  customers!: Customer[];

  /**
   * Name of Company.
   */
  @Column({ length: 50 })
  name!: string;

  /**
   * Email of Company.
   */
  @Column({ length: 100 })
  email!: string;

  /**
   * Street address Company is registered in.
   */
  @Column({ length: 100 })
  streetAddress!: string;

  /**
   * City Company is registered in.
   */
  @Column({ length: 100 })
  city!: string;

  /**
   * State Company is registered in.
   */
  @Column({ length: 100 })
  state!: string;

  /**
   * Country Company is registered in.
   */
  @Column({ length: 100 })
  country!: string;
}
