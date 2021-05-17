import { IDto } from '../dtos/i.dto';
import { IModel } from '../i.model';

/**
 * A template for service with basic CRUD.
 */
export abstract class ICrudService<Model extends IModel> {
  /**
   * Create a resource.
   * @param createDto DTO for creating resource
   * @returns newly created resource
   */
  abstract create(createDto: IDto): Promise<Model>;

  /**
   * Find a resource.
   * @param id UUID of resource
   * @returns resource
   */
  abstract get(id: string): Promise<Model | undefined>;

  /**
   * Update a resource.
   * @param id UUID of resource
   * @param updateDto DTO for updating resource
   */
  abstract update(id: string, updateDto: IDto): Promise<void>;

  /**
   * Delete a resource.
   * @param id UUID of resource to be deleted
   */
  abstract delete(id: string): Promise<void>;

  /**
   * List all resources of one type.
   * @param findDto find parameters and options
   * @returns list of resources
   */
  abstract list(findDto: IDto): Promise<Model[]>;
}
