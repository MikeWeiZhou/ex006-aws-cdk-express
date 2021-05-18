import { request } from '../../core/request';
import * as fake from '../../core/fake';
import { CompanyModelDto } from '../../../src/modules/company/dtos';

// root url path
const rootPath = '/companies';

// data clean up
const companiesToCleanup: CompanyModelDto[] = [];
afterAll(async () => {
  const deleteTasks = companiesToCleanup.map((company) => request.delete(`/companies/${company.id}`));
  await Promise.all(deleteTasks);
});

describe('error-handling', () => {
  it('400: can return correct status code on invalid json', async () => {
    const companyCreateDto = fake.company.dto();
    const invalidJsonData = `${JSON.stringify(companyCreateDto)},`;
    const post = await request
      .post(rootPath)
      .type('application/json')
      .send(invalidJsonData);

    expect(post.statusCode).toBe(400);
    expect(post.statusCode).toEqual(post.status);
  });
});
