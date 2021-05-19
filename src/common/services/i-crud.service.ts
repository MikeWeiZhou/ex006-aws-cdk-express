import { nanoid } from 'nanoid';
import constantsConfig from '../../config/constants.config';
import { InternalError } from '../../core/errors';
import { IDto } from '../dtos';
import { BaseModel } from '../models/base.model';

/**
 * A template for service with basic CRUD.
 */
export abstract class ICrudService<Model extends BaseModel> {
  protected readonly idPrefix: string;

  /**
   * Constructor.
   * @param idPrefix resource id prefix. (must be length of RESOURCE_ID_PREFIX_LENGTH)
   */
  constructor(idPrefix: string) {
    if (idPrefix.length !== constantsConfig.RESOURCE_ID_PREFIX_LENGTH) {
      throw new InternalError(`Database resource ID prefix length must be ${constantsConfig.RESOURCE_ID_PREFIX_LENGTH}.`);
    }
    this.idPrefix = idPrefix;
  }

  /**
   * Generate a secure random resource ID with prefix.
   * @returns resource ID
   */
  protected generateId(): string {
    return `${this.idPrefix}${nanoid(constantsConfig.RESOURCE_ID_GENERATED_LENGTH)}`;
  }

  /**
   * Create a resource.
   * @param createDto DTO for creating resource
   * @returns resource ID
   */
  abstract create(createDto: IDto): Promise<string>;

  /**
   * Find a resource.
   * @param getDto DTO for retrieving resource
   * @returns resource
   */
  abstract get(getDto: IDto): Promise<Model | undefined>;

  /**
   * Find a resource or fail.
   * @param getDto DTO for retrieving resource
   * @throws NotFoundError
   * @returns resource
   */
  abstract getOrFail(getDto: IDto): Promise<Model>;

  /**
   * Update a resource.
   * @param updateDto DTO for updating resource
   * @throws NotFoundError
   */
  abstract update(updateDto: IDto): Promise<void>;

  /**
   * Delete a resource.
   * @param deleteDto DTO for deleting resource
   * @throws NotFoundError
   */
  abstract delete(deleteDto: IDto): Promise<void>;

  /**
   * List all resources of one type.
   * @param [listDto] DTO containing list filters and options
   * @returns list of resources
   */
  abstract list(listDto?: IDto): Promise<Model[]>;
}
