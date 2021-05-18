import { nanoid } from 'nanoid';
import { InternalError } from '../core/errors';
import { IDto } from './dtos';
import { IModel } from './i.model';

/**
 * A template for service with basic CRUD.
 */
export abstract class ICrudService<Model extends IModel> {
  /**
   * Generate a random resource ID.
   * @param prefix prefix to generated id (must be length of 4)
   * @returns nanoid with 21 symbols + prefix with 4 symbols
   */
  protected generateId(prefix: string): string {
    if (prefix.length !== 4) {
      throw new InternalError('Resource ID prefix length must be 4.');
    }
    return (prefix)
      ? `${prefix}${nanoid()}`
      : nanoid();
  }

  /**
   * Create a resource.
   * @param createDto DTO for creating resource
   * @returns newly created resource
   */
  abstract create(createDto: IDto): Promise<Model>;

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
   * @param listDto DTO containing list filters and options
   * @returns list of resources
   */
  abstract list(listDto: IDto): Promise<Model[]>;
}
