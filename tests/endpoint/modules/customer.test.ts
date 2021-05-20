import { CompanyModelDto } from '../../../src/modules/company/dtos';
import { CustomerCreateDto, CustomerListDto, CustomerModelDto, CustomerUpdateDto } from '../../../src/modules/customer/dtos';
import * as fake from '../../core/faker';
import { request } from '../../core/request';

// root url path
const { rootPath } = fake.customer;

let company: CompanyModelDto;

beforeAll(async () => {
  company = await fake.company.create();
});

// data clean up
afterAll(async () => {
  await fake.customer.cleanGarbage();
  await fake.company.cleanGarbage();
});

describe('/customers', () => {
  /**
   * post /customers
   */
  describe('post /customers', () => {
    it('201: can create a Customer', async () => {
      const dto = await fake.customer.dto({ companyId: company.id });
      const post = await request
        .post(rootPath)
        .send(dto);

      expect(post.statusCode).toBe(201);
      expect(post.statusCode).toEqual(post.status);

      expect(post.body).toMatchObject({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        address: {
          address: dto.address.address,
        },
      });

      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        address: {
          address: dto.address.address,
        },
      });

      fake.customer.addToGarbageBin(post.body);
    });

    it('400: cannot create Customer with invalid or missing parameters', async () => {
      const validate = async (
        dto: Partial<CustomerCreateDto>,
        expectedInvalidParams: string[],
      ) => {
        const post = await request
          .post(rootPath)
          .send(dto);

        expect(post.statusCode).toBe(400);
        expect(post.statusCode).toEqual(post.status);
        expect(post.statusCode).toEqual(post.body.status);

        expect(post.body.type).toBe('InvalidRequestError');
        expectedInvalidParams.forEach((param) => {
          expect(post.body.params).toHaveProperty(param);
        });
      };

      let dto: CustomerCreateDto = await fake.customer.dto({ companyId: company.id });
      delete (dto as any).firstName;
      await validate(dto, ['firstName']);

      dto = await fake.customer.dto();
      delete (dto as any).email;
      await validate(dto, ['email']);

      dto = await fake.customer.dto();
      (dto as any).email = 'notAnEmail';
      await validate(dto, ['email']);

      dto = await fake.customer.dto();
      delete (dto as any).address.address;
      await validate(dto, []);
    });

    it('409: cannot create Customer with identical email', async () => {
      const customer1Dto = await fake.customer.dto({ companyId: company.id });
      const post1 = await request
        .post(rootPath)
        .send(customer1Dto);
      expect(post1.statusCode).toBe(201);
      expect(post1.statusCode).toEqual(post1.status);

      const customer2Dto = await fake.customer.dto({
        companyId: company.id,
        email: customer1Dto.email,
      });
      const post2 = await request
        .post(rootPath)
        .send(customer2Dto);
      expect(post2.statusCode).toBe(409);
      expect(post2.statusCode).toEqual(post2.status);

      fake.customer.addToGarbageBin(post1.body);
    });
  });

  /**
   * get /customers
   */
  describe('get /customers', () => {
    const firstNameWith7 = `Rose ${fake.faker.random.alphaNumeric(10)}`;
    let customers: CustomerModelDto[];

    beforeAll(async () => {
      const create = [];
      create.push(...[1, 2, 3, 4, 5, 6, 7].map(() => fake.customer.create({
        companyId: company.id,
        firstName: firstNameWith7,
      })));
      create.push(...[1, 2, 3, 4, 5, 6, 7, 8].map(() => fake.customer.create({
        companyId: company.id,
      })));
      customers = await Promise.all(create);
    });

    it('200: can list customers with no filters', async () => {
      const get = await request.get(rootPath).send({ companyId: company.id });
      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBeGreaterThan(7);
    });

    it('200: can receive empty list of customers', async () => {
      const customerCreateDto = await fake.customer.dto({ companyId: company.id });
      const customerListDto: CustomerListDto = {
        companyId: company.id,
        email: customerCreateDto.email,
      };
      const get = await request
        .get(rootPath)
        .send(customerListDto);
      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBe(0);
    });

    it('200: can list customers with various filters: firstName, country, limit, page', async () => {
      const get = await request
        .get(rootPath)
        .send({
          companyId: company.id,
          firstName: firstNameWith7,
          options: {
            limit: 6,
            page: 1,
          },
        } as CustomerListDto);

      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBe(6);
      get.body.forEach((customer: CustomerModelDto) => {
        expect(customer.firstName).toBe(firstNameWith7);
      });
    });

    it('200: can list customers with nested filters (address)', async () => {
      const get = await request
        .get(rootPath)
        .send({
          companyId: company.id,
          address: {
            address: customers[0].address.address,
          },
        } as CustomerListDto);

      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body.length).toBe(1);
    });
  });
});

describe('/customers/:id', () => {
  /**
   * get /customers/:id
   */
  describe('get /customers/:id', () => {
    it('200: can retrieve a Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const get = await request
        .get(`${rootPath}/${customer.id}`)
        .send({ companyId: company.id });
      expect(get.statusCode).toBe(200);
      expect(get.statusCode).toEqual(get.status);
      expect(get.body).toMatchObject({
        id: customer.id,
        companyId: company.id,
        firstName: customer.firstName,
        address: {
          country: customer.address.country,
        },
      });
    });

    it('404: cannot retrieve non-existent Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const nonExistentResourceId = `${customer.id.slice(0, -3)}abc`;
      const get = await request
        .get(`${rootPath}/${nonExistentResourceId}`)
        .send({ companyId: company.id });
      expect(get.statusCode).toBe(404);
      expect(get.statusCode).toEqual(get.status);
    });
  });

  /**
   * patch /customers/:id
   */
  describe('patch /customers/:id', () => {
    it('200: can update a Customer', async () => {
      const original: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const another: CustomerCreateDto = await fake.customer.dto({ companyId: company.id });

      const update: CustomerUpdateDto = {
        id: original.id,
        firstName: 'Bob',
        email: another.email,
        address: {
          address: '666 Unreachable Way',
        },
      };

      const patch = await request
        .patch(`${rootPath}/${original.id}`)
        .send(update);

      expect(patch.statusCode).toBe(200);
      expect(patch.statusCode).toEqual(patch.status);
      expect(patch.body).toMatchObject({
        firstName: update.firstName,
        email: update.email,
        address: {
          address: update.address?.address,
        },
      });
    });

    it('404: cannot update non-existent Customer', async () => {
      const original: CustomerModelDto = await fake.customer.create({ companyId: company.id });

      const update: Partial<CustomerUpdateDto> = {};
      const nonExistentId = `${original.id.slice(0, -3)}abc`;
      const patch = await request
        .patch(`${rootPath}/${nonExistentId}`)
        .send(update);

      expect(patch.statusCode).toBe(404);
      expect(patch.statusCode).toEqual(patch.status);
    });

    it('409: cannot update a Customer leading to duplicate email entries', async () => {
      const original: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const another: CustomerModelDto = await fake.customer.create({ companyId: company.id });

      const update: Partial<CustomerUpdateDto> = {
        email: another.email,
      };

      const patch = await request
        .patch(`${rootPath}/${original.id}`)
        .send(update);

      expect(patch.statusCode).toBe(409);
      expect(patch.statusCode).toEqual(patch.status);

      const get = await request.get(`${rootPath}/${original.id}`);
      expect(get.body).toMatchObject({
        address: {
          address: original.address.address,
        },
      });
    });
  });

  /**
   * delete /customers/:id
   */
  describe('delete /customers/:id', () => {
    it('204: can delete a Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });

      const del = await request.delete(`${rootPath}/${customer.id}`);
      expect(del.statusCode).toBe(204);
      expect(del.statusCode).toEqual(del.status);

      const get = await request.get(`${rootPath}/${customer.id}`);
      expect(get.statusCode).toBe(404);
      expect(get.statusCode).toEqual(get.status);
    });

    it('404: cannot delete same Customer twice', async () => {
      const customer: CustomerModelDto = await fake.customer.create();

      const del = await request.delete(`${rootPath}/${customer.id}`);
      expect(del.statusCode).toBe(204);
      expect(del.statusCode).toEqual(del.status);

      const delAgain = await request.delete(`${rootPath}/${customer.id}`);
      expect(delAgain.statusCode).toBe(404);
      expect(delAgain.statusCode).toEqual(delAgain.status);
    });

    it('404: cannot delete non-existent Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create();
      const nonExistentResourceId = `${customer.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
      expect(get.statusCode).toEqual(get.status);
    });
  });
});
