import faker from 'faker';
import { request } from '../request';
import { CompanyCreateDto, CompanyModelDto } from '../../../src/modules/company/dtos';
import { IFaker } from './i.faker';
import { address } from './address.faker';

export class CompanyFaker extends IFaker<CompanyCreateDto, CompanyModelDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/companies');
  }

  /**
   * Returns DTO used for creating a Company.
   * @param [dto] uses any provided properties over generated ones
   * @returns DTO
   */
  async dto(dto?: Partial<CompanyCreateDto>): Promise<CompanyCreateDto> {
    const name = dto?.name ?? `${faker.company.companyName()}`;
    const email = dto?.email
      ?? `${faker.internet.email(
        undefined,
        undefined,
        `${faker.helpers.slugify(name)}.com`,
      )}`;
    const addr = await address.dto(dto?.address);
    return {
      name,
      email,
      address: addr,
    };
  }

  /**
   * Creates a Company on test API server.
   * @param [dto] uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CompanyCreateDto>): Promise<CompanyModelDto> {
    const createDto = await this.dto(dto);
    const res = await request
      .post(this.rootPath)
      .send(createDto);
    this.addToGarbageBin(res.body);
    return res.body;
  }
}

export const company = new CompanyFaker();
