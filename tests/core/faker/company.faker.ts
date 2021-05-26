import { CreateCompanyDto, CompanyDto } from '@ear/modules/company';
import faker from 'faker';
import { request } from '../request';
import { address } from './address.faker';
import { IFaker } from './i.faker';

export class CompanyFaker extends IFaker<CreateCompanyDto, CompanyDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/companies');
  }

  /**
   * Returns generated data to create a Company.
   * @param dto uses any provided data over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns CreateCompanyDto
   */
  async dto(
    dto?: Partial<CreateCompanyDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<CreateCompanyDto> {
    const name = dto?.name ?? `${faker.company.companyName()}`;
    const email = dto?.email ?? `${faker.internet.email(
      undefined,
      undefined,
      `${faker.helpers.slugify(name)}.com`,
    )}`;
    const addr = await address.dto(dto?.address, noDatabaseWrites);
    return {
      name,
      email,
      address: addr,
    };
  }

  /**
   * Create a Company on API server.
   * @param dto uses any provided data over generated ones
   * @returns CompanyDto
   */
  async create(dto?: Partial<CreateCompanyDto>): Promise<CompanyDto> {
    const createDto = await this.dto(dto);
    const create = await request.post(this.rootPath).send(createDto);
    this.addToGarbageBin(create.body);
    return create.body;
  }
}

export const company = new CompanyFaker();
