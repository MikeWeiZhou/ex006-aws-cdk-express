import { CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import constantsConfig from '../../config/constants.config';

/**
 * Properties all models must have.
 */
@Entity()
export class BaseModel {
  /**
   * Unique resource identifier.
   */
  @PrimaryColumn({ length: constantsConfig.RESOURCE_ID_TOTAL_LENGTH })
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
