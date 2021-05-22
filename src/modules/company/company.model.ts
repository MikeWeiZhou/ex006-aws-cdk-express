import { IBaseModel } from '@ear/common/models';
import { constants } from '@ear/config';
import { Address } from '@ear/modules/address';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

/**
 * Company model.
 */
@Entity()
@Index(['email'], { unique: true })
export class Company extends IBaseModel {
  /**
   * Data model limits for Company.
   */
  static readonly limits = {
    /**
     * Maximum string length for name of Company.
     */
    NAME_MAX_LENGTH: 50,
    /**
     * Maximum string length for email contact of Company.
     */
    EMAIL_MAX_LENGTH: 100,
  };

  /**
   * Company Customer belongs to.
   */
  @OneToOne(() => Address, { cascade: ['insert', 'update', 'remove'] })
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
   * Name of Company.
   */
  @Column({
    type: 'varchar',
    length: Company.limits.NAME_MAX_LENGTH,
  })
  name!: string;

  /**
   * Email of Company.
   */
  @Column({
    type: 'varchar',
    length: Company.limits.EMAIL_MAX_LENGTH,
  })
  email!: string;
}
