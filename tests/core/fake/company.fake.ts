import faker from 'faker';
import request from '../request';
import { Company } from '../../../src/modules/company/company.model';
import { CompanyCreateDto } from '../../../src/modules/company/dtos/company.create.dto';

const urlPath = '/companies';

function createCompanyDto(company?: Partial<CompanyCreateDto>): CompanyCreateDto {
  const name = company?.name ?? `${faker.company.companyName()}`;
  const email = company?.email ?? `${faker.internet.email()}`;
  const address = company?.address
    ?? `${faker.address.streetAddress()} ${faker.address.streetName()} ${faker.address.streetSuffix()}`;
  return {
    name,
    email,
    address,
  };
}

async function createCompany(company?: Partial<CompanyCreateDto>): Promise<Company> {
  const dto = createCompanyDto(company);
  const res = await request
    .post(urlPath)
    .send(dto);
  return res.body;
}

/**
 * Company module.
 */
export const company = {
  /**
   * Create CompanyCreateDto.
   */
  dto: createCompanyDto,
  /**
   * Create new Company resource by sending request to API server.
   */
  resource: createCompany,
};
