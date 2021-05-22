import { IBaseModel } from '@ear/common/models';
import { Column, Entity } from 'typeorm';

/**
 * Address model.
 */
@Entity()
export class Address extends IBaseModel {
  /**
   * Data model limits for Address.
   */
  static readonly limits = {
    /**
     * Maximum string length for field address.
     */
    ADDRESS_MAX_LENGTH: 150,
    /**
     * Maximum string length for field postcode.
     */
    POSTCODE_MAX_LENGTH: 10,
    /**
     * Maximum string length for field city.
     */
    CITY_MAX_LENGTH: 100,
    /**
     * Maximum string length for field province.
     */
    PROVINCE_MAX_LENGTH: 100,
    /**
     * Maximum string length for field country.
     */
    COUNTRY_MAX_LENGTH: 100,
  };

  /**
   * Street address. (e.g. 1234 Terrace Road #133)
   */
  @Column({
    type: 'varchar',
    length: Address.limits.ADDRESS_MAX_LENGTH,
  })
  address!: string;

  /**
   * Postal code or zip address.
   */
  @Column({
    type: 'varchar',
    length: Address.limits.POSTCODE_MAX_LENGTH,
  })
  postcode!: string;

  /**
   * Name of city.
   */
  @Column({
    type: 'varchar',
    length: Address.limits.CITY_MAX_LENGTH,
  })
  city!: string;

  /**
   * Name of province or state.
   */
  @Column({
    type: 'varchar',
    length: Address.limits.PROVINCE_MAX_LENGTH,
  })
  province!: string;

  /**
   * Name of country.
   */
  @Column({
    type: 'varchar',
    length: Address.limits.COUNTRY_MAX_LENGTH,
  })
  country!: string;
}
