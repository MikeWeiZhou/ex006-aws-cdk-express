import { request } from '../request';
import { IBaseModelDto, IDto } from '../../../src/common/dtos';

/**
 * Base resource faker.
 */
export abstract class IFaker<CreateDto extends IDto, ModelDto extends IBaseModelDto> {
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
    const deleteTasks: Promise<any>[] = [];
    // iterating one-by-one incase multiple calls to cleanGarbage()
    for (
      let resource = this.garbage.pop();
      resource !== undefined;
      resource = this.garbage.pop()
    ) {
      deleteTasks.push(request.delete(`${this.rootPath}/${resource.id}`));
    }
    await Promise.all(deleteTasks);
  }

  /**
   * Returns DTO used for resource creation.
   * @param dto uses any provided properties over generated ones
   * @returns DTO
   */
  abstract dto(dto?: Partial<CreateDto>): Promise<CreateDto>;

  /**
   * Creates the resource on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  abstract create(dto?: Partial<CreateDto>): Promise<ModelDto>;
}
