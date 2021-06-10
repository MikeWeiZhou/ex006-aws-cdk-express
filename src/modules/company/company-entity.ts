import { BaseEntityColumns, BaseEntityConstraints, IBaseEntity } from '@ear/common';
import { Address } from '@ear/modules/address';
import { EntitySchema } from 'typeorm';

/**
 * Company entity model.
 */
export interface Company extends IBaseEntity {
  /**
   * Company name.
   */
  name: string;

  /**
   * Company Address.
   */
  address: Address;

  /**
   * Company Address ID.
   */
  addressId: string;
}

/**
 * Company entity constraints.
 */
export const CompanyEntityConstraints = {
  /**
   * Maximum string length for name of Company.
   */
  NAME_MAX_LENGTH: 50,
};

/**
 * Company entity schema.
 */
export const CompanyEntity = new EntitySchema<Company>({
  name: 'Company',
  columns: {
    ...BaseEntityColumns,
    name: {
      type: 'varchar',
      length: CompanyEntityConstraints.NAME_MAX_LENGTH,
    },
    addressId: {
      name: 'address_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
  },
  relations: {
    address: {
      target: 'Address',
      type: 'one-to-one',
      joinColumn: {
        name: 'address_id',
      },
    },
  },
});
