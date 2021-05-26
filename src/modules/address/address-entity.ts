import { IBaseEntity, BaseEntityColumns } from '@ear/common';
import { EntitySchema } from 'typeorm';

/**
 * Address entity model.
 */
export interface Address extends IBaseEntity {
  /**
   * First line of address field. (e.g. 123 Crescent Road)
   */
  line1: string;

  /**
   * Postal code of address. (e.g. V5L2M2)
   */
  postcode: string;

  /**
   * City of address. (e.g. Vancouver)
   */
  city: string;

  /**
   * Province of address. (e.g. British Columbia or BC)
   */
  province: string;

  /**
   * Country of address. (e.g. Canada)
   */
  country: string;
}

/**
 * Address entity constraints.
 */
export const AddressEntityConstraints = {
  /**
   * Maximum string length for field address.
   */
  LINE1_MAX_LENGTH: 150,

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
 * Address entity schema.
 */
export const AddressEntity = new EntitySchema<Address>({
  name: 'Address',
  columns: {
    ...BaseEntityColumns,
    line1: {
      type: 'varchar',
      length: AddressEntityConstraints.LINE1_MAX_LENGTH,
    },
    postcode: {
      type: 'varchar',
      length: AddressEntityConstraints.POSTCODE_MAX_LENGTH,
    },
    city: {
      type: 'varchar',
      length: AddressEntityConstraints.CITY_MAX_LENGTH,
    },
    province: {
      type: 'varchar',
      length: AddressEntityConstraints.PROVINCE_MAX_LENGTH,
    },
    country: {
      type: 'varchar',
      length: AddressEntityConstraints.COUNTRY_MAX_LENGTH,
    },
  },
});
