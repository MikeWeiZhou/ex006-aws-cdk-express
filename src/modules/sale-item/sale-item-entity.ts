import { BaseEntityColumns, BaseEntityConstraints, IBaseEntity } from '@ear/common';
import { constants } from '@ear/config';
import { EntitySchema } from 'typeorm';
import { Product } from '../product';
import { Sale } from '../sale/sale-entity';

/**
 * SaleItem entity model.
 */
export interface SaleItem extends IBaseEntity {
  /**
   * Quantity of SaleItem.
   */
  quantity: number;

  /**
   * Price per SaleItem unit.
   */
  pricePerUnit?: number;

  /**
   * Total price for this SaleItem.
   */
  total: number;

  /**
   * Sale that owns this SaleItem.
   */
  sale: Sale;

  /**
   * ID of Sale that owns this SaleItem.
   */
  saleId: string;

  /**
   * Product this SaleItem tracks.
   */
  product: Product;

  /**
   * ID of Product that this SaleItem tracks.
   */
  productId: string;
}

/**
 * SaleItem entity constraints.
 */
export const SaleItemEntityConstraints = {
  /**
   * Maximum positive integer value for quantity.
   */
  QUANTITY_MAX_VALUE: 1000,

  /**
   * Maximum positive integer value for SaleItem price per unit in cents.
   */
  PRICE_PER_UNIT_MAX_VALUE: 99999999,

  /**
   * Maximum positive integer value for SaleItem total price in cents.
   */
  TOTAL_MAX_VALUE: constants.MAX_MYSQL_UNSIGNED_INT_VALUE,
};

/**
 * SaleItem entity schema.
 */
export const SaleItemEntity = new EntitySchema<SaleItem>({
  name: 'SaleItem',
  columns: {
    ...BaseEntityColumns,
    quantity: {
      type: 'int',
      unsigned: true,
    },
    pricePerUnit: {
      name: 'price_per_unit',
      type: 'int',
      unsigned: true,
    },
    total: {
      type: 'int',
      unsigned: true,
    },
    saleId: {
      name: 'sale_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
    productId: {
      name: 'product_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
  },
  relations: {
    sale: {
      target: 'Sale',
      inverseSide: 'saleItems',
      type: 'many-to-one',
      joinColumn: {
        name: 'sale_id',
      },
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      joinColumn: {
        name: 'product_id',
      },
    },
  },
  indices: [
    {
      name: 'idx_sale_item_unique_product',
      unique: true,
      columns: ['saleId', 'productId'],
    },
  ],
});
