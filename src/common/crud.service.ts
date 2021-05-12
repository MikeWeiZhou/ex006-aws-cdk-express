import { Model } from './model';

/**
 * Properties for a find operation in a CRUD service.
 */
export interface CrudServiceFindProps {
  /**
   * Maximum number of results to return.
   */
  limit?: number;
  /**
   * Page number.
   *
   * The results returned would be offset by limit * (page - 1).
   */
  page?: number;
}

/**
 * A template for service with basic CRUD.
 */
export abstract class CrudService<M extends Model> {
  /**
   * Create a resource.
   * @param entity resource
   * @returns newly created resource
   */
  abstract create(entity: M): Promise<M>;

  /**
   * Find a resource.
   * @param id UUID of resource
   * @returns resource
   */
  abstract findOne(id: string): Promise<M | undefined>;

  /**
   * Update a resource.
   * @param id UUID of resource
   * @param entity resource with desired changes
   */
  abstract update(id: string, entity: M): Promise<void>;

  /**
   * Delete a resource.
   * @param id UUID of resource to be deleted
   */
  abstract delete(id: string): Promise<void>;

  /**
   * Find many resources.
   * @param props properties for a find operation
   * @returns list of resources of same type
   */
  abstract find(props: CrudServiceFindProps): Promise<M[]>;
}
