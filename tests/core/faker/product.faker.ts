import { Currency } from '@ear/common/enums';
import { companyService } from '@ear/modules/company';
import { ProductCreateDto, ProductModelDto } from '@ear/modules/product/dtos';
import faker from 'faker';
import { request } from '../request';
import { company } from './company.faker';
import { IFaker } from './i.faker';

export class ProductFaker extends IFaker<ProductCreateDto, ProductModelDto> {
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
    dto?: Partial<ProductCreateDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<ProductCreateDto> {
    const companyId = dto?.companyId
      ?? ((noDatabaseWrites && await companyService.generateId()) || (await company.create()).id);
    const name = dto?.name ?? `${faker.commerce.productName()}`;
    const description = dto?.description ?? `${faker.commerce.productDescription()}`;
    const sku = dto?.sku ?? `${faker.datatype.string(20)}`;
    const price = dto?.price ?? faker.datatype.number({ min: 0, max: 99999999 });
    const currency = dto?.currency ?? this.randomSupportedCurrency();
    return {
      companyId,
      name,
      description,
      sku,
      price,
      currency,
    };
  }

  /**
   * Creates a Product on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<ProductCreateDto>): Promise<ProductModelDto> {
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

  /**
   * Generate random supported currency value.
   * @returns SupportedCurrency
   */
  private randomSupportedCurrency(): Currency {
    const currencies = Object.values(Currency);
    const index = faker.datatype.number({ min: 0, max: currencies.length - 1 });
    return currencies[index];
  }
}

export const product = new ProductFaker();
