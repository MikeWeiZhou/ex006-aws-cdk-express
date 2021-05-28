import { BaseEntityColumns, BaseEntityConstraints, IBaseEntity } from '@ear/common';
import { Customer } from '@ear/modules/customer';
import { EntitySchema } from 'typeorm';
import { Company } from '../company';
import { NestedSaleItemDto } from '../sale-item/dtos/nested-sale-item-dto';
import { SaleStatusCode } from './types';

/**
 * Sale entity model.
 */
export interface Sale extends IBaseEntity {
  /**
   * SaleStatusCode.
   */
  statusCode: SaleStatusCode;

  /**
   * Total price of Sale.
   */
  total: number;

  /**
   * Comments.
   */
  comments?: string;

  /**
   * Company that SaleItems belong to.
   */
  company: Company;

  /**
   * ID of Company that SaleItems bleongs to.
   */
  companyId: string;

  /**
   * Customer that Sale belongs to.
   */
  customer: Customer;

  /**
   * ID of Customer that Sale bleongs to.
   */
  customerId: string;

  /**
   * SaleItems.
   */
  saleItems: NestedSaleItemDto[];
}

/**
 * Sale entity constraints.
 */
export const SaleEntityConstraints = {
  /**
   * Maximum string length for comments.
   */
  COMMENTS_MAX_LENGTH: 255,

  /**
   * Maximum string length for status code.
   */
  STATUS_CODE_MAX_LENGTH: 25,
};

/**
 * Sale entity schema.
 */
export const SaleEntity = new EntitySchema<Sale>({
  name: 'Sale',
  columns: {
    ...BaseEntityColumns,
    statusCode: {
      name: 'status_code',
      type: 'varchar',
      length: SaleEntityConstraints.STATUS_CODE_MAX_LENGTH,
    },
    comments: {
      type: 'varchar',
      length: SaleEntityConstraints.COMMENTS_MAX_LENGTH,
    },
    total: {
      type: 'int',
      unsigned: true,
    },
    companyId: {
      name: 'company_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
    customerId: {
      name: 'customer_id',
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
    customer: {
      target: 'Customer',
      type: 'many-to-one',
      joinColumn: {
        name: 'customer_id',
      },
    },
    saleItems: {
      target: 'SaleItem',
      inverseSide: 'sale',
      type: 'one-to-many',
    },
  },
});
