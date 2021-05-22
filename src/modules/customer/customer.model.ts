import { IBaseModel } from '@ear/common/models';
import { constants } from '@ear/config';
import { Address } from '@ear/modules/address';
import { Company } from '@ear/modules/company';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

/**
 * Company model.
 */
@Entity()
@Index(['companyId', 'email'], { unique: true })
export class Customer extends IBaseModel {
  /**
   * Company Customer belongs to.
   */
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  /**
   * Company Customer belongs to.
   */
  @Column({ length: constants.RESOURCE_ID_TOTAL_LENGTH })
  companyId!: string;

  /**
   * Company Customer belongs to.
   */
  @OneToOne(() => Address, { cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'addressId' })
  address!: Address;

  /**
   * Company Customer belongs to.
   */
  @Column({ length: constants.RESOURCE_ID_TOTAL_LENGTH })
  addressId!: string;

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
}
