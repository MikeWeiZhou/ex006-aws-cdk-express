import { request } from '../../core/request';
import * as fake from '../../core/faker';

// root url path
const { rootPath } = fake.company;

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
