import faker from 'faker';
import { request } from '../request';
import { CompanyCreateDto, CompanyModelDto } from '../../../src/modules/company/dtos';

const urlPath = '/companies';

function createCompanyDto(company?: Partial<CompanyCreateDto>): CompanyCreateDto {
  const name = company?.name ?? `${faker.company.companyName()}`;
  const email = company?.email
    ?? `${faker.internet.email(
      undefined,
      undefined,
      `${faker.helpers.slugify(name)}.com`,
    )}`;
  const streetAddress = company?.streetAddress
    ?? `${faker.address.streetAddress()} ${faker.address.streetName()} ${faker.address.streetSuffix()}`;
  const city = company?.city ?? `${faker.address.cityName()}`;
  const state = company?.state ?? `${faker.address.state()}`;
  const country = company?.country ?? `${faker.address.country()}`;
  return {
    name,
    email,
    streetAddress,
    city,
    state,
    country,
  };
}

async function createCompany(company?: Partial<CompanyCreateDto>): Promise<CompanyModelDto> {
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
   * Root URL path for company resource.
   */
  urlPath,
  /**
   * Create CompanyCreateDto.
   */
  dto: createCompanyDto,
  /**
   * Create new Company resource by sending request to API server.
   */
  resource: createCompany,
};
