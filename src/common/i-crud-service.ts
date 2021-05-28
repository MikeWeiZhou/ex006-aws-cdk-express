import { InternalError } from '@ear/core';
import { nanoid } from 'nanoid/async';
import { EntityManager, getConnection, SelectQueryBuilder } from 'typeorm';
import { IDto } from './dtos/i-dto';
import { BaseEntityConstraints } from './i-base-entity';

/**
 * A template for service with basic CRUD.
 */
export abstract class ICrudService<Entity> {
  /**
   * Run database queries in a transaction.
   * @param callback function containing queries to run
   * @param entityManager manager from an existing transaction
   * @returns value from callback method
   */
  static async transaction<ReturnValue>(
    callback: (manager: EntityManager) => Promise<ReturnValue>,
    entityManager?: EntityManager,
  ): Promise<ReturnValue> {
    let manager = entityManager;
    let queryRunner;

    if (typeof manager === 'undefined') {
      queryRunner = getConnection().createQueryRunner();
      await queryRunner.startTransaction();
      manager = queryRunner.manager;
    }

    try {
      const returnValue = await callback(manager);
      await queryRunner?.commitTransaction();
      return returnValue;
    } catch (error) {
      await queryRunner?.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner?.release();
    }
  }

  /**
   * Resource ID prefix.
   */
  protected readonly idPrefix: string;

  /**
   * Constructor.
   * @param idPrefix resource id prefix. (must be length of RESOURCE_ID_PREFIX_LENGTH)
   */
  constructor(idPrefix: string) {
    if (idPrefix.length !== BaseEntityConstraints.RESOURCE_ID_PREFIX_LENGTH) {
      throw new InternalError(`Database resource ID prefix length must be ${BaseEntityConstraints.RESOURCE_ID_PREFIX_LENGTH}.`);
    }
    this.idPrefix = idPrefix;
  }

  /**
   * Create a resource.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  abstract create(createDto: IDto, entityManager?: EntityManager): Promise<string>;

  /**
   * Returns a resource.
   * @param getDto contains resource ID
   * @param entityManager used for transactions
   * @returns resource or undefined if not found
   */
  abstract get(getDto: IDto, entityManager?: EntityManager): Promise<Entity | undefined>;

  /**
   * Returns a resource or fail.
   * @param getDto contains resource ID
   * @param entityManager used for transactions
   * @returns resource
   */
  abstract getOrFail(getDto: IDto, entityManager?: EntityManager): Promise<Entity>;

  /**
   * Update a resource.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  abstract update(updateDto: IDto, entityManager?: EntityManager): Promise<void>;

  /**
   * Delete a resource.
   * @param deleteDto contains resource ID
   * @param entityManager used for transactions
   */
  abstract delete(deleteDto: IDto, entityManager?: EntityManager): Promise<void>;

  /**
   * Generate a secure random resource ID with prefix.
   * @returns resource ID
   */
  async generateId(): Promise<string> {
    const generated = await nanoid(BaseEntityConstraints.RESOURCE_ID_GENERATED_LENGTH);
    return `${this.idPrefix}${generated}`;
  }

  /**
   * Builds where clause for list methods.
   *
   * This is a work-around for nested object filtering.
   * https://github.com/typeorm/typeorm/issues/2707
   *
   * @param qb TypeORM SelectQueryBuilder
   * @param clauses filter clauses as key-value pairs, can be nested
   */
  protected buildListWhereClause(
    qb: SelectQueryBuilder<Entity>,
    tableAlias: string,
    filters: any,
    isFirst: boolean = true,
  ) {
    let first = isFirst;
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object') {
        this.buildListWhereClause(qb, `${tableAlias}__${key}`, value, first);
        first = false;
        return;
      }

      if (first) {
        first = false;
        qb.where(`${tableAlias}.${key} = :${key}`, { [key]: [value] });
      } else {
        qb.andWhere(`${tableAlias}.${key} = :${key}`, { [key]: [value] });
      }
    });
  }
}
