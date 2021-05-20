import { nanoid } from 'nanoid';
import { EntityManager } from 'typeorm';
import constants from '../../config/constants';
import { InternalError } from '../../core/errors';
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
   * Generate a secure random resource ID with prefix.
   * @returns resource ID
   */
  protected generateId(): string {
    return `${this.idPrefix}${nanoid(constants.RESOURCE_ID_GENERATED_LENGTH)}`;
  }

  /**
   * Create a resource.
   * @param createDto contains fields to insert to database
   * @param [entityManager] used for transactions
   * @returns resource id
   */
  abstract create(createDto: IDto, entityManager?: EntityManager): Promise<string>;

  /**
   * Find a resource.
   * @param getDto contains filters identifying a single wanted resource
   * @param [entityManager] used for transactions
   * @returns resource
   */
  abstract get(getDto: IDto, entityManager?: EntityManager): Promise<Model | undefined>;

  /**
   * Find a resource or fail.
   * @param getDto contains filters identifying a single wanted resource
   * @param [entityManager] used for transactions
   * @throws NotFoundError
   * @returns resource
   */
  abstract getOrFail(getDto: IDto, entityManager?: EntityManager): Promise<Model>;

  /**
   * Update a resource.
   * @param updateDto contains fields needing update
   * @param [entityManager] used for transactions
   * @throws NotFoundError
   */
  abstract update(updateDto: IDto, entityManager?: EntityManager): Promise<void>;

  /**
   * Delete a resource.
   * @param deleteDto contains filters identifying a single wanted resource
   * @param [entityManager] used for transactions
   * @throws NotFoundError
   */
  abstract delete(deleteDto: IDto, entityManager?: EntityManager): Promise<void>;

  /**
   * List all resources of one type.
   * @param [listDto] contains filters and list options
   * @param [entityManager] used for transactions
   * @returns list of resources
   */
  abstract list(listDto?: IDto, entityManager?: EntityManager): Promise<Model[]>;
}
