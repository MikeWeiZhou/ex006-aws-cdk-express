import { companyService } from '@ear/modules/company';
import { CustomerCreateDto, CustomerModelDto } from '@ear/modules/customer/dtos';
import faker from 'faker';
import { request } from '../request';
import { address } from './address.faker';
import { company } from './company.faker';
import { IFaker } from './i.faker';

export class CustomerFaker extends IFaker<CustomerCreateDto, CustomerModelDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/customers');
  }

  /**
   * Returns DTO used for creating a Customer.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<CustomerCreateDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<CustomerCreateDto> {
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

export const customer = new CustomerFaker();
