import { BaseEntityColumns, BaseEntityConstraints, IBaseEntity } from '@ear/common';
import { Company } from '@ear/modules/company';
import { EntitySchema } from 'typeorm';

/**
 * Product entity model.
 */
export interface Product extends IBaseEntity {
  /**
   * Name of Product.
   */
  name: string;

  /**
   * Description of product.
   */
  description?: string;

  /**
   * Product SKU.
   */
  sku: string;

  /**
   * Product price.
   */
  price: number;

  /**
   * Company that carries this Product.
   */
  company: Company;

  /**
   * ID of Company that carries this Product.
   */
  companyId: string;
}

/**
 * Product entity constraints.
 */
export const ProductEntityConstraints = {
  /**
   * Maximum string length for name of Product.
   */
  NAME_MAX_LENGTH: 100,

  /**
   * Maximum string length for description.
   */
  DESCRIPTION_MAX_LENGTH: 255,

  /**
   * Maximum string length for product SKU.
   */
  SKU_MAX_LENGTH: 100,

  /**
   * Maximum positive integer value for product price in cents.
   */
  PRICE_MAX_VALUE: 99999999,
};

/**
 * Product entity schema.
 */
export const ProductEntity = new EntitySchema<Product>({
  name: 'Product',
  columns: {
    ...BaseEntityColumns,
    name: {
      type: 'varchar',
      length: ProductEntityConstraints.NAME_MAX_LENGTH,
    },
    description: {
      type: 'varchar',
      length: ProductEntityConstraints.DESCRIPTION_MAX_LENGTH,
    },
    sku: {
      type: 'varchar',
      length: ProductEntityConstraints.SKU_MAX_LENGTH,
    },
    price: {
      type: 'int',
      unsigned: true,
    },
    companyId: {
      name: 'company_id',
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
  },
  indices: [
    {
      name: 'idx_product_unique_sku',
      unique: true,
      columns: ['companyId', 'sku'],
    },
  ],
});
