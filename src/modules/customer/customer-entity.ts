import { BaseEntityColumns, BaseEntityConstraints, IBaseEntity } from '@ear/common';
import { Address } from '@ear/modules/address';
import { Company } from '@ear/modules/company';
import { EntitySchema } from 'typeorm';

/**
 * Customer entity model.
 */
export interface Customer extends IBaseEntity {
  /**
   * First name of Customer.
   */
  firstName: string;

  /**
   * Last name of Customer.
   */
  lastName: string;

  /**
   * Customer's email.
   */
  email: string;

  /**
   * Company that Customer belongs to.
   */
  company: Company;

  /**
   * Company ID that Customer belongs to.
   */
  companyId: string;

  /**
   * Customer's Address.
   */
  address: Address;

  /**
   * Address ID of Customer's Address.
   */
  addressId: string;
}

/**
 * Customer entity constraints.
 */
export const CustomerEntityConstraints = {
  /**
   * Maximum string length for first name of Customer.
   */
  FIRST_NAME_MAX_LENGTH: 50,

  /**
   * Maximum string length for last name of Customer.
   */
  LAST_NAME_MAX_LENGTH: 50,

  /**
   * Maximum string length for email address.
   */
  EMAIL_MAX_LENGTH: 100,
};

/**
 * Customer entity schema.
 */
export const CustomerEntity = new EntitySchema<Customer>({
  name: 'Customer',
  columns: {
    ...BaseEntityColumns,
    firstName: {
      name: 'first_name',
      type: 'varchar',
      length: CustomerEntityConstraints.FIRST_NAME_MAX_LENGTH,
    },
    lastName: {
      name: 'last_name',
      type: 'varchar',
      length: CustomerEntityConstraints.LAST_NAME_MAX_LENGTH,
    },
    email: {
      type: 'varchar',
      length: CustomerEntityConstraints.EMAIL_MAX_LENGTH,
    },
    companyId: {
      name: 'company_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
    addressId: {
      name: 'address_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
  },
  relations: {
    company: {
      target: 'Company',
      type: 'many-to-one',
      joinColumn: {
        name: 'company_id',
      },
    },
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
      name: 'idx_customer_unique_email',
      unique: true,
      columns: ['companyId', 'email'],
    },
  ],
});
