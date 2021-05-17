import request from '../../../core/request';
import * as fake from '../../../core/fake';
import { Company } from '../../../../src/modules/company/company.model';
import { CompanyCreateDto } from '../../../../src/modules/company/dtos/company.create.dto';
import { CompanyListDto } from '../../../../src/modules/company/dtos/company.list.dto';
import { CompanyUpdateDto } from '../../../../src/modules/company/dtos/company.update.dto';

// root url path
const rootPath = '/companies';

// data clean up
const companiesToCleanup: Company[] = [];
afterAll(async () => {
  const deleteTasks = companiesToCleanup.map((company) => request.delete(`/companies/${company.id}`));
  await Promise.all(deleteTasks);
});

describe('/companies', () => {
  describe('post', () => {
    it('201: can create a Company', async () => {
      const companyCreateDto = fake.company.dto();
      const post = await request
        .post(rootPath)
        .send(companyCreateDto);

      expect(post.statusCode).toBe(201);
      expect(post.statusCode).toEqual(post.status);
      companiesToCleanup.push(post.body);

      expect(post.body).toMatchObject({
        name: companyCreateDto.name,
        address: companyCreateDto.address,
        email: companyCreateDto.email,
      });

      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject({
        name: companyCreateDto.name,
        address: companyCreateDto.address,
        email: companyCreateDto.email,
      });
    });

    it('400: cannot create Company with invalid or missing parameters', async () => {
      const validate = async (
        companyCreateDto: Partial<CompanyCreateDto>,
        expectedInvalidParams: string[],
      ) => {
        const post = await request
          .post(rootPath)
          .send(companyCreateDto);

        expect(post.statusCode).toBe(400);
        expect(post.statusCode).toEqual(post.status);
        expect(post.statusCode).toEqual(post.body.status);

        expect(post.body.type).toBe('InvalidRequestError');
        expectedInvalidParams.forEach((param) => {
          expect(post.body.params).toHaveProperty(param);
        });
      };

      let companyCreateDto: Partial<CompanyCreateDto> = fake.company.dto();
      delete companyCreateDto.name;
      await validate(companyCreateDto, ['name']);

      companyCreateDto = fake.company.dto();
      delete companyCreateDto.email;
      await validate(companyCreateDto, ['email']);

      companyCreateDto = fake.company.dto();
      companyCreateDto.email = 'notAnEmail';
      await validate(companyCreateDto, ['email']);

      companyCreateDto = fake.company.dto();
      delete companyCreateDto.address;
      await validate(companyCreateDto, ['address']);
    });

    it('409: cannot create Company with identical email', async () => {
      const company1Dto = fake.company.dto();
      const post1 = await request
        .post(rootPath)
        .send(company1Dto);
      expect(post1.statusCode).toBe(201);
      expect(post1.statusCode).toEqual(post1.status);
      companiesToCleanup.push(post1.body);

      const company2Dto = fake.company.dto({ email: company1Dto.email });
      const post2 = await request
        .post(rootPath)
        .send(company2Dto);
      expect(post2.statusCode).toBe(409);
      expect(post2.statusCode).toEqual(post2.status);
    });
  });

  describe('get', () => {
    const nameWith7 = `Henrik's Specialty Shop ${fake.faker.random.alphaNumeric(20)}`;

    beforeAll(async () => {
      const create = [];
      create.push(...[1, 2, 3, 4, 5, 6, 7].map(() => fake.company.resource({ name: nameWith7 })));
      create.push(...[1, 2, 3, 4, 5, 6, 7, 8].map(() => fake.company.resource()));
      const created = await Promise.all(create);
      companiesToCleanup.push(...created);
    });

    it('200: can list companies', async () => {
      const get = await request.get(rootPath);
      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBeGreaterThan(7);
    });

    it('200: can receive empty list of companies', async () => {
      const companyCreateDto = await fake.company.dto();
      const companyListDto: CompanyListDto = { email: companyCreateDto.email };
      const get = await request
        .get(rootPath)
        .send(companyListDto);
      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBe(0);
    });

    it('200: can list companies with filters: name, limit, page', async () => {
      const get = await request
        .get(rootPath)
        .send({
          name: nameWith7,
          options: {
            limit: 6,
            page: 1,
          },
        } as CompanyListDto);

      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBe(6);
      get.body.forEach((company: Company) => {
        expect(company.name).toBe(nameWith7);
      });
    });
  });
});

describe('/companies/:id', () => {
  describe('get', () => {
    it('200: can retrieve a Company', async () => {
      const company: Company = await fake.company.resource();
      companiesToCleanup.push(company);

      const get = await request.get(`${rootPath}/${company.id}`);
      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.id).toBe(company.id);
    });

    it('200: cannot see Company\'s secret field', async () => {
      const company: Company = await fake.company.resource();
      companiesToCleanup.push(company);

      const get = await request.get(`${rootPath}/${company.id}`);
      expect(get.body.secret).toBeUndefined();
    });

    it('404: cannot retrieve non-existent Company', async () => {
      const company: Company = await fake.company.resource();
      companiesToCleanup.push(company);

      const nonExistentResourceId = `${company.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
      expect(get.statusCode).toEqual(get.status);
    });
  });

  describe('patch', () => {
    it('200: can update a Company', async () => {
      const original: Company = await fake.company.resource();
      companiesToCleanup.push(original);
      // update all info
      const update: CompanyUpdateDto = {
        id: original.id,
        name: 'Genuine Winery',
        address: '666 Unreachable Way',
        email: 'veryslow@veryfast.org',
      };

      const patch = await request
        .patch(`${rootPath}/${original.id}`)
        .send(update);

      expect(patch.statusCode).toBe(200);
      expect(patch.statusCode).toEqual(patch.status);
      expect(patch.body).toMatchObject({
        name: update.name,
        address: update.address,
        email: update.email,
      });

      // update partial info
      const update2: Partial<CompanyUpdateDto> = {
        address: '666 Unreachable Way',
      };

      const patch2 = await request
        .patch(`${rootPath}/${original.id}`)
        .send(update2);

      expect(patch2.statusCode).toBe(200);
      expect(patch2.statusCode).toEqual(patch2.status);
      expect(patch2.body).toMatchObject({
        name: update.name,
        address: update2.address,
        email: update.email,
      });
    });

    it('404: cannot update non-existent Company', async () => {
      const original: Company = await fake.company.resource();
      companiesToCleanup.push(original);

      const update: Partial<CompanyUpdateDto> = {};
      const nonExistentId = `${original.id.slice(0, -3)}abc`;
      const patch = await request
        .patch(`${rootPath}/${nonExistentId}`)
        .send(update);

      expect(patch.statusCode).toBe(404);
      expect(patch.statusCode).toEqual(patch.status);
    });

    it('409: cannot update a Company leading to duplicate email entries', async () => {
      const original: Company = await fake.company.resource();
      const another: Company = await fake.company.resource();
      companiesToCleanup.push(original, another);

      const update: Partial<CompanyUpdateDto> = {
        email: another.email,
      };

      const patch = await request
        .patch(`${rootPath}/${original.id}`)
        .send(update);

      expect(patch.statusCode).toBe(409);
      expect(patch.statusCode).toEqual(patch.status);

      const get = await request.get(`${rootPath}/${original.id}`);
      expect(get.body).toMatchObject({
        address: original.address,
      });
    });
  });

  describe('delete', () => {
    it('204: can delete a Company', async () => {
      const company: Company = await fake.company.resource();

      const del = await request.delete(`${rootPath}/${company.id}`);
      expect(del.statusCode).toBe(204);
      expect(del.statusCode).toEqual(del.status);

      const get = await request.get(`${rootPath}/${company.id}`);
      expect(get.statusCode).toBe(404);
      expect(get.statusCode).toEqual(get.status);
    });

    it('404: cannot delete same Company twice', async () => {
      const company: Company = await fake.company.resource();

      const del = await request.delete(`${rootPath}/${company.id}`);
      expect(del.statusCode).toBe(204);
      expect(del.statusCode).toEqual(del.status);

      const delAgain = await request.delete(`${rootPath}/${company.id}`);
      expect(delAgain.statusCode).toBe(404);
      expect(delAgain.statusCode).toEqual(delAgain.status);
    });

    it('404: cannot delete non-existent Company', async () => {
      const company: Company = await fake.company.resource();
      companiesToCleanup.push(company);

      const nonExistentResourceId = `${company.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
      expect(get.statusCode).toEqual(get.status);
    });
  });
});
