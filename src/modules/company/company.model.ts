import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IModel } from '../../common/i.model';

/**
 * Company database model.
 */
@Entity()
export class Company implements IModel {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column('varchar', { length: 255 })
  name!: string;

  @Expose()
  @Column('varchar', { length: 255 })
  address!: string;

  @Expose()
  @Column('varchar', {
    unique: true,
    length: 255,
  })
  email!: string;

  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Exclude()
  @Column('varchar', {
    length: 255,
    default: 'no show',
  })
  secret?: string = 'no show';
}
