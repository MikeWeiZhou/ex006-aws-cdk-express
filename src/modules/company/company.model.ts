import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { IBaseModel } from '../../common/models/i-base.model';
import { constants } from '../../config';
import { Address } from '../address/address.model';

/**
 * Company model.
 */
@Entity()
@Index(['email'], { unique: true })
export class Company extends IBaseModel {
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
   * Name of Company.
   */
  @Column({ length: 50 })
  name!: string;

  /**
   * Email of Company.
   */
  @Column({ length: 100 })
  email!: string;
}
