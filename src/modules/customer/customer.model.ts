import { IModel } from '@ear/common';
import { constants } from '@ear/config';
import { Address } from '@ear/modules/address';
import { Company } from '@ear/modules/company';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

/**
 * Company model.
 */
@Entity()
@Index(['companyId', 'email'], { unique: true })
export class Customer extends IModel {
  /**
   * Data model limits for Customer.
   */
  static readonly limits = {
    /**
     * Maximum string length for Customer's first name.
     */
    FIRST_NAME_MAX_LENGTH: 50,
    /**
     * Maximum string length for Customer's last name.
     */
    LAST_NAME_MAX_LENGTH: 50,
    /**
     * Maximum string length for Customer's email address.
     */
    EMAIL_MAX_LENGTH: 100,
  };

  /**
   * Company Customer belongs to.
   */
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  /**
   * Company Customer belongs to.
   */
  @Column({
    type: 'char',
    length: constants.RESOURCE_ID_TOTAL_LENGTH,
  })
  companyId!: string;

  /**
   * Company Customer belongs to.
   */
  @OneToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address!: Address;

  /**
   * Company Customer belongs to.
   */
  @Column({
    type: 'char',
    length: constants.RESOURCE_ID_TOTAL_LENGTH,
  })
  addressId!: string;

  /**
   * First name of Customer.
   */
  @Column({
    type: 'varchar',
    length: Customer.limits.FIRST_NAME_MAX_LENGTH,
  })
  firstName!: string;

  /**
   * First name of Customer.
   */
  @Column({
    type: 'varchar',
    length: Customer.limits.LAST_NAME_MAX_LENGTH,
  })
  lastName!: string;

  /**
   * Email of Customer.
   */
  @Column({
    type: 'varchar',
    length: Customer.limits.EMAIL_MAX_LENGTH,
  })
  email!: string;
}
