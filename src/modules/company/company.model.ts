import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Model } from '../../common/model';

/**
 * Company database model.
 */
@Entity()
export class Company implements Model {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('nvarchar', { length: 255 })
  name!: string;

  @Column('nvarchar', { length: 255 })
  address!: string;

  @Column('nvarchar', { length: 255 })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
