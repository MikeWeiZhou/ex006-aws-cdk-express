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
   * Company email.
   */
  email: string;

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

  /**
   * Maximum string length for email address.
   */
  EMAIL_MAX_LENGTH: 100,
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
    email: {
      type: 'varchar',
      length: CompanyEntityConstraints.EMAIL_MAX_LENGTH,
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
  indices: [
    {
      name: 'idx_company_unique_email',
      unique: true,
      columns: ['email'],
    },
  ],
});
