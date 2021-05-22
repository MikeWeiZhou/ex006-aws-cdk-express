import { Currency } from '@ear/common/enums';
import { IBaseModel } from '@ear/common/models';
import { constants } from '@ear/config';
import { Company } from '@ear/modules/company';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

/**
 * Product model.
 */
@Entity()
@Index(['companyId', 'sku'], { unique: true })
export class Product extends IBaseModel {
  /**
   * Company that carries this product.
   */
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  /**
   * Company that carries this product.
   */
  @Column({ length: constants.RESOURCE_ID_TOTAL_LENGTH })
  companyId!: string;

  /**
   * Product name.
   */
  @Column({ length: 100 })
  name!: string;

  /**
   * Short description of product.
   */
  @Column({
    nullable: true,
    length: 255,
  })
  description?: string;

  /**
   * Stock Keeping Unit (sku) of product.
   */
  @Column({ length: 100 })
  sku!: string;

  /**
   * Price of product in smallest currency unit.
   */
  @Column({ unsigned: true }) // MySQL 5.7 unsigned int max value: 4,294,967,295
  price!: number;

  /**
   * Currency that price is in.
   */
  @Column({
    type: 'varchar',
    length: 3,
  })
  currency!: Currency;
}
