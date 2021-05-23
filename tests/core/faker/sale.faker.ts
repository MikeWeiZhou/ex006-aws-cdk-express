import { companyService } from '@ear/modules/company';
import { CustomerCreateDto, CustomerModelDto } from '@ear/modules/customer/dtos';
import { SaleCreateDto, SaleModelDto } from '@ear/modules/sale/dtos';
import faker from 'faker';
import { request } from '../request';
import { address } from './address.faker';
import { company } from './company.faker';
import { IFaker } from './i.faker';

export class SaleFaker extends IFaker<SaleCreateDto, SaleModelDto> {
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
    dto?: Partial<SaleCreateDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<SaleCreateDto> {
    const companyId = dto?.companyId
      ?? ((noDatabaseWrites && await companyService.generateId()) || (await company.create()).id);
    const firstName = dto?.firstName ?? `${faker.name.firstName()}`;
    const lastName = dto?.lastName ?? `${faker.name.lastName()}`;
    const email = dto?.email ?? `${faker.internet.email(firstName, lastName)}`;
    const addr = await address.dto(dto?.address, noDatabaseWrites);
    return {
      companyId,
      firstName,
      lastName,
      email,
      address: addr,
    };
  }

  /**
   * Creates a Customer on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CustomerCreateDto>): Promise<CustomerModelDto> {
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

export const customer = new SaleFaker();
