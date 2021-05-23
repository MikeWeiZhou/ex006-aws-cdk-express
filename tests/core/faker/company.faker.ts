import { CompanyCreateDto, CompanyModelDto } from '@ear/modules/company/dtos';
import faker from 'faker';
import { request } from '../request';
import { address } from './address.faker';
import { IFaker } from './i.faker';

export class CompanyFaker extends IFaker<CompanyCreateDto, CompanyModelDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/companies');
  }

  /**
   * Returns DTO used for creating a Company.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<CompanyCreateDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<CompanyCreateDto> {
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
   * Creates a Company on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CompanyCreateDto>): Promise<CompanyModelDto> {
    const createDto = await this.dto(dto);
    const create = await request.post(this.rootPath).send(createDto);
    this.addToGarbageBin(create.body);
    return create.body;
  }
}

export const company = new CompanyFaker();
