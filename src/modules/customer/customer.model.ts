import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/models/base.model';
// eslint-disable-next-line import/no-cycle
import { Company } from '../company/company.model';

/**
 * Company model.
 */
@Entity()
@Index('idx_customer_unique_email', ['email', 'company'], { unique: true })
export class Customer extends BaseModel {
  /**
   * Company Customer belongs to.
   */
  @ManyToOne('Company', 'customers')
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column({ length: 25 })
  companyId!: string;

  /**
   * First name of Customer.
   */
  @Column({ length: 50 })
  firstName!: string;

  /**
   * First name of Customer.
   */
  @Column({ length: 50 })
  lastName!: string;

  /**
   * Email of Customer.
   */
  @Column({ length: 100 })
  email!: string;

  /**
   * Street address Customer lives in.
   */
  @Column({ length: 100 })
  streetAddress!: string;

  /**
   * City Customer lives in.
   */
  @Column({ length: 100 })
  city!: string;

  /**
   * State Customer lives in.
   */
  @Column({ length: 100 })
  state!: string;

  /**
   * Country Customer lives in.
   */
  @Column({ length: 100 })
  country!: string;
}
