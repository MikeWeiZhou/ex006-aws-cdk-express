import { nanoid } from 'nanoid';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';

/**
 * Properties all models must have.
 */
export interface IModel {
  /**
   * Unique resource identifier.
   */
  id: string;

  /**
   * Creation date of resource.
   */
  createdAt: Date;

  /**
   * Last updated at.
   */
  updatedAt: Date;
}

/**
 * Database columns all models must have.
 */
export const BaseSchemaColumns = {
  id: {
    primary: true,
    type: String,
    length: 25,
  } as EntitySchemaColumnOptions,
  createdAt: {
    type: Date,
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    type: Date,
    updateDate: true,
  } as EntitySchemaColumnOptions,
};
