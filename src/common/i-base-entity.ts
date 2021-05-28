import { EntitySchemaColumnOptions } from 'typeorm';

/**
 * All entity models must have these.
 */
export interface IBaseEntity {
  /**
   * Resource ID.
   */
  id: string;

  /**
   * Resource creation date in UTC.
   */
  createdAt: Date;

  /**
   * Resource last updated date in UTC.
   */
  updatedAt: Date;
}

/**
 * Base entity constraints.
 */
export const BaseEntityConstraints = {
  /**
   * Length of resource ID prefix.
   */
  RESOURCE_ID_PREFIX_LENGTH: 4,

  /**
   * Length of generated portion of resource ID.
   */
  RESOURCE_ID_GENERATED_LENGTH: 21,

  /**
   * Total length of resource ID.
   * RESOURCE_ID_PREFIX_LENGTH + RESOURCE_ID_GENERATED_LENGTH
   */
  RESOURCE_ID_TOTAL_LENGTH: 25,
};

/**
 * All entities must have these columns.
 */
export const BaseEntityColumns = {
  id: {
    type: 'char',
    primary: true,
    length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: 'created_at',
    type: 'datetime',
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updated_at',
    type: 'datetime',
    updateDate: true,
  } as EntitySchemaColumnOptions,
};
