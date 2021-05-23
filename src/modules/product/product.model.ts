import { CurrencyCode, IModel } from '@ear/common';
import { constants } from '@ear/config';
import { Company } from '@ear/modules/company';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

/**
 * Product model.
 */
@Entity()
@Index(['companyId', 'sku'], { unique: true })
export class Product extends IModel {
  /**
   * Data model limits for Product.
   */
  static readonly limits = {
    /**
     * Maximum string length for product name.
     */
    NAME_MAX_LENGTH: 100,
    /**
     * Maximum string length for product description.
     */
    DESCRIPTION_MAX_LENGTH: 255,
    /**
     * Maximum string length for product sku.
     */
    SKU_MAX_LENGTH: 100,
    /**
     * Maximum positive integer value for product price.
     */
    PRICE_MAX_VALUE: 99999999,
  };

  /**
   * Company that carries this product.
   */
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  /**
   * Company that carries this product.
   */
  @Column({
    type: 'char',
    length: constants.RESOURCE_ID_TOTAL_LENGTH,
  })
  companyId!: string;

  /**
   * Product name.
   */
  @Column({
    type: 'varchar',
    length: Product.limits.NAME_MAX_LENGTH,
  })
  name!: string;

  /**
   * Short description of product.
   */
  @Column({
    type: 'varchar',
    nullable: true,
    length: Product.limits.DESCRIPTION_MAX_LENGTH,
  })
  description?: string;

  /**
   * Stock Keeping Unit (sku) of product.
   */
  @Column({
    type: 'varchar',
    length: Product.limits.SKU_MAX_LENGTH,
  })
  sku!: string;

  /**
   * Price of product in smallest currency unit, e.g. cents in dollars.
   */
  @Column({
    type: 'int',
    unsigned: true,
  }) // MySQL 5.7 unsigned int max value: 4,294,967,295
  price!: number;

  /**
   * Currency that price is in.
   */
  @Column({
    type: 'char',
    length: 3,
  })
  currency!: CurrencyCode;
}
