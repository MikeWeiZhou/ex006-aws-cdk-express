import { companyService } from '@ear/modules/company';
import { CreateProductDto, ProductDto } from '@ear/modules/product';
import faker from 'faker';
import { request } from '../request';
import { company } from './company.faker';
import { IFaker } from './i.faker';

export class ProductFaker extends IFaker<CreateProductDto, ProductDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/products');
  }

  /**
   * Returns DTO used for creating a Product.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<CreateProductDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<CreateProductDto> {
    const companyId = dto?.companyId
      ?? ((noDatabaseWrites && await companyService.generateId()) || (await company.create()).id);
    const name = dto?.name ?? `${faker.commerce.productName()}`;
    const description = dto?.description ?? `${faker.commerce.productDescription()}`;
    const sku = dto?.sku ?? `${faker.datatype.string(20)}`;
    const price = dto?.price ?? faker.datatype.number({ min: 0, max: 10000 });
    return {
      companyId,
      name,
      description,
      sku,
      price,
    };
  }

  /**
   * Creates a Product on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CreateProductDto>): Promise<ProductDto> {
    const createDto = await this.dto(dto);
    const create = await request.post(this.rootPath).send(createDto);
    this.addToGarbageBin(create.body);
    return create.body;
  }

  /**
   * @override
   * All resources in garbage bin will be deleted from the server.
   */
  async cleanGarbage(): Promise<void> {
    await super.cleanGarbage();
    await company.cleanGarbage();
  }
}

export const product = new ProductFaker();
