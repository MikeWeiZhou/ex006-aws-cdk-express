import faker from 'faker';
import { request } from '../request';
import { CustomerCreateDto, CustomerModelDto } from '../../../src/modules/customer/dtos';
import { IFaker } from './i.faker';
import { company } from './company.faker';

export class CustomerFaker extends IFaker<CustomerCreateDto, CustomerModelDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/customers');
  }

  /**
   * Returns DTO used for creating a Customer.
   * @param [dto] uses any provided properties over generated ones
   * @returns DTO
   */
  async dto(dto?: Partial<CustomerCreateDto>): Promise<CustomerCreateDto> {
    const companyId = dto?.companyId ?? (await company.create()).id;
    const firstName = dto?.firstName ?? `${faker.name.firstName()}`;
    const lastName = dto?.lastName ?? `${faker.name.lastName()}`;
    const email = dto?.email ?? `${faker.internet.email(firstName, lastName)}`;
    const streetAddress = dto?.streetAddress
      ?? `${faker.address.streetAddress()} ${faker.address.streetName()} ${faker.address.streetSuffix()}`;
    const city = dto?.city ?? `${faker.address.cityName()}`;
    const state = dto?.state ?? `${faker.address.state()}`;
    const country = dto?.country ?? `${faker.address.country()}`;
    return {
      companyId,
      firstName,
      lastName,
      email,
      streetAddress,
      city,
      state,
      country,
    };
  }

  /**
   * Creates a Customer on test API server.
   * @param [dto] uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CustomerCreateDto>): Promise<CustomerModelDto> {
    const createDto = await this.dto(dto);
    const res = await request
      .post(this.rootPath)
      .send(createDto);
    this.addToGarbageBin(res.body);
    return res.body;
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
