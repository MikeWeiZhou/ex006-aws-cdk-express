import { constants } from '@ear/config';
import { CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * Properties all models must have.
 */
@Entity()
export abstract class IModel {
  /**
   * Unique resource identifier.
   */
  @PrimaryColumn({
    type: 'char',
    length: constants.RESOURCE_ID_TOTAL_LENGTH,
  })
  id!: string;

  /**
   * Creation date of resource.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Last updated at.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
