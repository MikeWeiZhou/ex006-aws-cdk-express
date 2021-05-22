import { constants } from '@ear/config';
import { InternalError } from '@ear/core/errors';
import { nanoid } from 'nanoid/async';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { IDto } from '../dtos';
import { IBaseModel } from '../models/i-base.model';

/**
 * A template for service with basic CRUD.
 */
export abstract class ICrudService<Model extends IBaseModel> {
  protected readonly idPrefix: string;

  /**
   * Constructor.
   * @param idPrefix resource id prefix. (must be length of RESOURCE_ID_PREFIX_LENGTH)
   */
  constructor(idPrefix: string) {
    if (idPrefix.length !== constants.RESOURCE_ID_PREFIX_LENGTH) {
      throw new InternalError(`Database resource ID prefix length must be ${constants.RESOURCE_ID_PREFIX_LENGTH}.`);
    }
    this.idPrefix = idPrefix;
  }

  /**
   * Create a resource.
   * @param createDto contains fields to insert to database
   * @param entityManager used for transactions
   * @returns resource id
   */
  abstract create(createDto: IDto, entityManager?: EntityManager): Promise<string>;

  /**
   * Find a resource.
   * @param getDto contains filters identifying a single wanted resource
   * @param entityManager used for transactions
   * @returns resource
   */
  abstract get(getDto: IDto, entityManager?: EntityManager): Promise<Model | undefined>;

  /**
   * Find a resource or fail.
   * @param getDto contains filters identifying a single wanted resource
   * @param entityManager used for transactions
   * @throws NotFoundError
   * @returns resource
   */
  abstract getOrFail(getDto: IDto, entityManager?: EntityManager): Promise<Model>;

  /**
   * Update a resource.
   * @param updateDto contains fields needing update
   * @param entityManager used for transactions
   * @throws NotFoundError
   */
  abstract update(updateDto: IDto, entityManager?: EntityManager): Promise<void>;

  /**
   * Delete a resource.
   * @param deleteDto contains filters identifying a single wanted resource
   * @param entityManager used for transactions
   * @throws NotFoundError
   */
  abstract delete(deleteDto: IDto, entityManager?: EntityManager): Promise<void>;

  /**
   * List all resources of one type.
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns list of resources
   */
  abstract list(listDto?: IDto, entityManager?: EntityManager): Promise<Model[]>;

  /**
   * Generate a secure random resource ID with prefix.
   * @returns resource ID
   */
  protected async generateId(): Promise<string> {
    const generated = await nanoid(constants.RESOURCE_ID_GENERATED_LENGTH);
    return `${this.idPrefix}${generated}`;
  }

  /**
   * Builds where clause for list methods.
   *
   * This is a work-around for nested object filtering.
   * https://github.com/typeorm/typeorm/issues/2707
   *
   * @param qb TypeORM SelectQueryBuilder
   * @param clauses filter clauses as key-value pairs
   */
  protected buildListWhereClause<Entity>(
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
