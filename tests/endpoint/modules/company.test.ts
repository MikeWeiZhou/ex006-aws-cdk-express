import { Response } from 'supertest';
import { CompanyCreateDto, CompanyListDto, CompanyModelDto, CompanyUpdateDto } from '../../../src/modules/company/dtos';
import * as fake from '../../core/faker';
import { customer } from '../../core/faker';
import { request } from '../../core/request';
import { testUtility } from '../../core/test-utility';

// root url path
const { rootPath } = fake.company;

// data clean up
afterAll(async () => {
  await fake.company.cleanGarbage();
});

describe('/companies', () => {
  /**
   * post /companies
   */
  describe('post /companies', () => {
    it('201: can create Company', async () => {
      // post response identical to create dto
      const createDto = await fake.company.dto();
      const post = await request.post(rootPath).send(createDto);
      expect(post.statusCode).toBe(201);
      expect(post.body).toMatchObject(createDto);

      // post response identical to get response
      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject(post.body);

      fake.company.addToGarbageBin(post.body);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create Company with missing parameters', async () => {
      let dto: CompanyCreateDto;
      let post: Response;

      // missing root-level parameters and object
      dto = await fake.company.dto();
      delete (dto as any).email;
      delete (dto as any).name;
      delete (dto as any).address;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'email',
        'name',
        'address',
      ]);

      // missing nested parameters
      dto = await fake.company.dto();
      delete (dto as any).address.country;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'address.country',
      ]);
      // missing nested parameters
      dto = await fake.company.dto();
      delete (dto as any).address.address;
      delete (dto as any).address.postcode;
      delete (dto as any).address.city;
      delete (dto as any).address.province;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'address.address',
        'address.postcode',
        'address.city',
        'address.province',
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create Company with invalid parameters', async () => {
      let dto: CompanyCreateDto;
      let post: Response;

      // invalid root-level parameters and object
      dto = await fake.company.dto();
      (dto as any).email = 'notAnEmail';
      (dto as any).name = '';
      (dto as any).address = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'email',
        'name',
        'address',
      ]);

      // invalid nested parameters
      dto = await fake.company.dto();
      (dto as any).address.address = '';
      (dto as any).address.postcode = '';
      (dto as any).address.city = '';
      (dto as any).address.province = '';
      (dto as any).address.country = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'address.address',
        'address.postcode',
        'address.city',
        'address.province',
        'address.country',
      ]);
    });

    it('409: cannot create Company with identical email', async () => {
      const company1Dto = await fake.company.dto();
      const post1 = await request.post(rootPath).send(company1Dto);
      expect(post1.statusCode).toBe(201);

      // no duplicate email
      const company2Dto = await fake.company.dto({ email: company1Dto.email });
      const post2 = await request.post(rootPath).send(company2Dto);
      expect(post2.statusCode).toBe(409);
      expect(post2.body.status).toBe(409);

      fake.company.addToGarbageBin(post1.body);
    });
  });

  /**
   * get /companies
   */
  describe('get /companies', () => {
    const nameWith7 = `Henrik's Specialty Shop ${fake.faker.random.alphaNumeric(20)}`;

    beforeAll(async () => {
      const create = [];
      create.push(
        ...[1, 2, 3, 4, 5, 6, 7].map(
          () => fake.company.create({ name: nameWith7 }),
        ),
      );
      create.push(
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(
          () => fake.company.create(),
        ),
      );
      await Promise.all(create);
    });

    it('200: can list companies with no filters', async () => {
      const get = await request.get(rootPath);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBeGreaterThan(7);
      // contains expected properties
      [
        'id',
        'name',
        'email',
        'address.id',
        'address.address',
        'address.postcode',
        'address.city',
        'address.province',
        'address.country',
      ].forEach((param) => expect(get.body[0]).toHaveProperty(param));
    });

    it('200: can list companies with zero results', async () => {
      const createDto = await fake.company.dto();
      const listDto: CompanyListDto = { email: createDto.email };
      const get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(0);
    });

    it('200: can list companies with filters', async () => {
      let company: CompanyModelDto;
      let listDto: CompanyListDto;
      let get: Response;

      // results of companies with root filters
      company = await fake.company.create();
      listDto = { email: company.email };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      get.body.forEach((comp: CompanyModelDto) => {
        expect(comp).toHaveProperty('email', listDto.email);
      });

      // results of companies with nested filters
      company = await fake.company.create();
      listDto = { address: company.address };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      get.body.forEach((comp: CompanyModelDto) => {
        expect(comp).toHaveProperty('address', listDto.address);
      });

      // results of companies with specified name (created 7 with identical name)
      listDto = { name: nameWith7 };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(7);
      get.body.forEach((comp: CompanyModelDto) => {
        expect(comp.name).toBe(nameWith7);
      });
    });

    it('200: can list companies with pagination', async () => {
      let get: Response;
      let listDto: CompanyListDto;

      // has more than 5 results
      get = await request.get(rootPath);
      expect(get.body.length).toBeGreaterThan(5);

      // limit to 1 result
      listDto = { options: { limit: 1, page: 1 } };
      get = await request.get(rootPath).send(listDto);
      expect(get.body.length).toBe(1);
      const firstCustomer = get.body[0];

      // second page contains different results from first page
      listDto = { options: { limit: 3, page: 2 } };
      get = await request.get(rootPath).send(listDto);
      expect(get.body.length).toBe(3);
      get.body.forEach((company: CompanyModelDto) => {
        expect(company.id).not.toBe(firstCustomer.id);
      });
    });
  });
});

describe('/companies/:id', () => {
  /**
   * get /companies/:id
   */
  describe('get /companies/:id', () => {
    it('200: can get Company', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const get = await request.get(`${rootPath}/${company.id}`);
      expect(get.statusCode).toBe(200);
      expect(get.body).toMatchObject(company);
    });

    it('404: cannot get non-existent Company', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const nonExistentResourceId = `${company.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
    });
  });

  /**
   * patch /companies/:id
   */
  describe('patch /companies/:id', () => {
    it('200: can update Company', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const dto: CompanyCreateDto = await fake.company.dto();

      const update: CompanyUpdateDto = {
        ...dto,
        id: company.id,
      };
      const patch = await request.patch(`${rootPath}/${company.id}`).send(update);

      expect(patch.statusCode).toBe(200);
      expect(patch.body).toMatchObject({
        ...update,
        id: company.id,
      });
    });

    it('404: cannot update non-existent Company', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const nonExistentId = `${company.id.slice(0, -3)}abc`;
      const patch = await request.patch(`${rootPath}/${nonExistentId}`);
      expect(patch.statusCode).toBe(404);
    });

    it('409: cannot update Company leading to duplicate email', async () => {
      const original: CompanyModelDto = await fake.company.create();
      const another: CompanyModelDto = await fake.company.create();

      // duplicate email
      const update: Partial<CompanyUpdateDto> = { email: another.email };
      const patch = await request.patch(`${rootPath}/${original.id}`).send(update);
      expect(patch.statusCode).toBe(409);
      expect(patch.body.status).toBe(409);

      // confirm no change
      const get = await request.get(`${rootPath}/${original.id}`);
      expect(get.body).toMatchObject(original);
    });
  });

  /**
   * delete /companies/:id
   */
  describe('delete /companies/:id', () => {
    it('204: can delete Company', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const del = await request.delete(`${rootPath}/${company.id}`);
      expect(del.statusCode).toBe(204);

      // confirm cannot get
      const get = await request.get(`${rootPath}/${company.id}`);
      expect(get.statusCode).toBe(404);
    });

    it('404: cannot delete same Company twice', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const del = await request.delete(`${rootPath}/${company.id}`);
      expect(del.statusCode).toBe(204);

      const delAgain = await request.delete(`${rootPath}/${company.id}`);
      expect(delAgain.statusCode).toBe(404);
    });

    it('404: cannot delete non-existent Company', async () => {
      const company: CompanyModelDto = await fake.company.create();
      const nonExistentResourceId = `${company.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
    });
  });
});
