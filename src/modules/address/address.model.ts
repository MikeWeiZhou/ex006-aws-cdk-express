import { IBaseModel } from '@ear/common/models';
import { Column, Entity } from 'typeorm';

/**
 * Address model.
 */
@Entity()
export class Address extends IBaseModel {
  /**
   * Street address. (e.g. 1234 Terrace Road #133)
   */
  @Column({ length: 150 })
  address!: string;

  /**
   * Postal code or zip address.
   */
  @Column({ length: 10 })
  postcode!: string;

  /**
   * Name of city.
   */
  @Column({ length: 100 })
  city!: string;

  /**
   * Name of province or state.
   */
  @Column({ length: 100 })
  province!: string;

  /**
   * Name of country.
   */
  @Column({ length: 100 })
  country!: string;
}
