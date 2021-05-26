import { IDto, IResponseBaseDto } from '@ear/common';
import { request } from '../request';

/**
 * Base resource faker.
 */
export abstract class IFaker<CreateDto extends IDto, ModelDto extends IResponseBaseDto> {
  /**
   * Resources to be deleted.
   */
  private readonly garbage: ModelDto[];

  /**
   * Resource URL root path (after the domain name).
   */
  readonly rootPath: string;

  /**
   * Constructor.
   * @param rootPath resource URL root path (after the domain name).
   */
  constructor(rootPath: string) {
    this.garbage = [];
    this.rootPath = rootPath;
  }

  /**
   * Adds manually created resource to garbage bin, to be cleaned from server at a later time.
   * Resources created by calling create() will automatically be added to garbage bin.
   * @param dto model-like DTO of a resource
   */
  addToGarbageBin(dtos: ModelDto): void;
  addToGarbageBin(dtos: ModelDto[]): void;
  addToGarbageBin(dtos: any): void {
    if (Array.isArray(dtos)) {
      this.garbage.push(...dtos);
      return;
    }
    this.garbage.push(dtos);
  }

  /**
   * All resources in garbage bin will be deleted from the server.
   */
  async cleanGarbage(): Promise<void> {
    const deleteTasks = this.garbage.map((resource) => request.delete(`${this.rootPath}/${resource.id}`));
    await Promise.all(deleteTasks);
  }

  /**
   * Returns DTO used for resource creation.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  abstract dto(dto?: Partial<CreateDto>, noDatabaseWrites?: boolean): Promise<CreateDto>;

  /**
   * Creates the resource on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  abstract create(dto?: Partial<CreateDto>): Promise<ModelDto>;
}
