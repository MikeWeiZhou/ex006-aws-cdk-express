import { PartialExcept } from '@ear/common';
import { CompanyDto, companyService } from '@ear/modules/company';
import { CustomerDto, customerService } from '@ear/modules/customer';
import { CreateSaleDto, SaleDto } from '@ear/modules/sale';
import { NestedCreateSaleItemDto } from '@ear/modules/sale-item';
import faker from 'faker';
import { request } from '../request';
import { company } from './company.faker';
import { customer } from './customer.faker';
import { IFaker } from './i.faker';
import { product } from './product.faker';
import { saleItem } from './sale-item.faker';

export class SaleFaker extends IFaker<CreateSaleDto, SaleDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/sales');
  }

  /**
   * Returns DTO used for creating a Sale.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<CreateSaleDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<CreateSaleDto> {
    // shared resources
    const comments = dto?.comments ?? `${faker.company.catchPhraseDescriptor()}`;

    // do not create prerequisite entities in database
    if (noDatabaseWrites) {
      const companyId = dto?.companyId ?? await companyService.generateId();
      const customerId = dto?.customerId ?? await customerService.generateId();
      const saleItems = dto?.saleItems ?? [await saleItem.dto(undefined, true)];
      return {
        companyId,
        customerId,
        comments,
        saleItems,
      };
    }

    // create prerequisite entities in database if needed
    const createdCompany: PartialExcept<CompanyDto, 'id'> = (dto?.companyId)
      ? { id: dto.companyId }
      : await company.create();

    const createdCustomer: PartialExcept<CustomerDto, 'id'> = (dto?.customerId)
      ? { id: dto.customerId }
      : await customer.create({ companyId: createdCompany.id });

    let saleItems: NestedCreateSaleItemDto[] | undefined = dto?.saleItems;
    if (!saleItems) {
      const createdProduct = await product.create({ companyId: createdCompany.id });
      saleItems = [await saleItem.dto({ productId: createdProduct.id })];
    }

    return {
      companyId: createdCompany.id,
      customerId: createdCustomer.id,
      comments,
      saleItems,
    };
  }

  /**
   * Creates a Sale on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CreateSaleDto>): Promise<SaleDto> {
    const createDto = await this.dto(dto);
    const create = await request.post(this.rootPath).send(createDto);
    this.addToGarbageBin(create.body);
    return create.body;
  }

  /**
   * All resources in garbage bin will be deleted from the server.
   */
  async cleanGarbage(): Promise<void> {
    await super.cleanGarbage();
    await product.cleanGarbage();
    await customer.cleanGarbage();
    await company.cleanGarbage();
  }
}

export const sale = new SaleFaker();
