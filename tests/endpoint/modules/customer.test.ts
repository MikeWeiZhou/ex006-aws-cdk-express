import { Response } from 'supertest';
import { CompanyModelDto } from '../../../src/modules/company/dtos';
import { CustomerCreateDto, CustomerListDto, CustomerModelDto, CustomerUpdateDto } from '../../../src/modules/customer/dtos';
import * as fake from '../../core/faker';
import { request } from '../../core/request';
import { testUtility } from '../../core/test-utility';

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
    it('201: can create Customer', async () => {
      // post response identical to create dto
      const createDto = await fake.customer.dto({ companyId: company.id });
      const post = await request.post(rootPath).send(createDto);
      expect(post.statusCode).toBe(201);
      expect(post.body).toMatchObject(createDto);

      // post response identical to get response
      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject(post.body);

      fake.customer.addToGarbageBin(post.body);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create Customer with missing parameters', async () => {
      let dto: CustomerCreateDto;
      let post: Response;

      // missing root-level parameters and object
      dto = await fake.customer.dto({ companyId: company.id });
      delete (dto as any).email;
      delete (dto as any).firstName;
      delete (dto as any).lastName;
      delete (dto as any).companyId;
      delete (dto as any).address;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'email',
        'firstName',
        'companyId',
        'address',
      ]);

      // missing nested parameters
      dto = await fake.customer.dto({ companyId: company.id });
      delete (dto as any).address.country;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'address.country',
      ]);
      // missing nested parameters
      dto = await fake.customer.dto({ companyId: company.id });
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
    it('400: cannot create Customer with invalid parameters', async () => {
      let dto: CustomerCreateDto;
      let post: Response;

      // invalid root-level parameters and object
      dto = await fake.customer.dto({ companyId: company.id });
      (dto as any).email = 'notAnEmail';
      (dto as any).firstName = '';
      (dto as any).lastName = '';
      (dto as any).address = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'email',
        'firstName',
        'firstName',
        'address',
      ]);

      // invalid nested parameters
      dto = await fake.customer.dto({ companyId: company.id });
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

    it('409: cannot create Customer with identical email', async () => {
      const customer1Dto = await fake.customer.dto({ companyId: company.id });
      const post1 = await request.post(rootPath).send(customer1Dto);
      expect(post1.statusCode).toBe(201);

      // no duplicate email
      const customer2Dto = await fake.customer.dto({
        companyId: company.id,
        email: customer1Dto.email,
      });
      const post2 = await request.post(rootPath).send(customer2Dto);
      expect(post2.statusCode).toBe(409);
      expect(post2.body.status).toBe(409);

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
      create.push(
        ...[1, 2, 3, 4, 5, 6, 7].map(
          () => fake.customer.create({ companyId: company.id, firstName: firstNameWith7 }),
        ),
      );
      create.push(
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(
          () => fake.customer.create({ companyId: company.id }),
        ),
      );
      customers = await Promise.all(create);
    });

    it('200: can list customers with no filters', async () => {
      const get = await request.get(rootPath).send({ companyId: company.id });
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBeGreaterThan(7);
      // contains expected properties
      [
        'id',
        'firstName',
        'lastName',
        'email',
        'address.id',
        'address.address',
        'address.postcode',
        'address.city',
        'address.province',
        'address.country',
      ].forEach((param) => expect(get.body[0]).toHaveProperty(param));
    });

    it('200: can list customers with zero results', async () => {
      const createDto = await fake.customer.dto();
      const listDto: CustomerListDto = { companyId: createDto.companyId };
      const get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(0);
    });

    it('200: can list customers with filters', async () => {
      let customer: CustomerModelDto;
      let listDto: CustomerListDto;
      let get: Response;

      // results of customers with root filters
      customer = await fake.customer.create({ companyId: company.id });
      listDto = { email: customer.email };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      get.body.forEach((cust: CustomerModelDto) => {
        expect(cust).toHaveProperty('email', listDto.email);
      });

      // results of customers with nested filters
      customer = await fake.customer.create({ companyId: company.id });
      listDto = { address: customer.address };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      get.body.forEach((cust: CustomerModelDto) => {
        expect(cust).toHaveProperty('address', listDto.address);
      });

      // results of customers with specified first name (created 7 with identical first name)
      listDto = { firstName: firstNameWith7 };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(7);
      get.body.forEach((cust: CustomerModelDto) => {
        expect(cust.firstName).toBe(firstNameWith7);
      });
    });

    it('200: can list customers with pagination', async () => {
      let get: Response;
      let listDto: CustomerListDto;

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
      get.body.forEach((customer: CustomerModelDto) => {
        expect(customer.id).not.toBe(firstCustomer.id);
      });
    });
  });
});

describe('/customers/:id', () => {
  /**
   * get /customers/:id
   */
  describe('get /customers/:id', () => {
    it('200: can get Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const get = await request.get(`${rootPath}/${customer.id}`);
      expect(get.statusCode).toBe(200);
      expect(get.body).toMatchObject(customer);
    });

    it('404: cannot get non-existent Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const nonExistentResourceId = `${customer.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
    });
  });

  /**
   * patch /customers/:id
   */
  describe('patch /customers/:id', () => {
    it('200: can update Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const dto: CustomerCreateDto = await fake.customer.dto({ companyId: company.id });

      const update: CustomerUpdateDto = {
        ...dto,
        id: customer.id,
      };
      const patch = await request.patch(`${rootPath}/${customer.id}`).send(update);
      expect(patch.statusCode).toBe(200);
      expect(patch.body).toMatchObject({
        ...update,
        id: customer.id,
      });
    });

    it('404: cannot update non-existent Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const nonExistentId = `${customer.id.slice(0, -3)}abc`;
      const patch = await request.patch(`${rootPath}/${nonExistentId}`);
      expect(patch.statusCode).toBe(404);
    });

    it('409: cannot update Customer leading to duplicate email', async () => {
      const original: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const another: CustomerModelDto = await fake.customer.create({ companyId: company.id });

      // duplicate email
      const update: Partial<CustomerUpdateDto> = { email: another.email };
      const patch = await request.patch(`${rootPath}/${original.id}`).send(update);
      expect(patch.statusCode).toBe(409);
      expect(patch.body.status).toBe(409);

      // confirm no change
      const get = await request.get(`${rootPath}/${original.id}`);
      expect(get.body).toMatchObject(original);
    });
  });

  /**
   * delete /customers/:id
   */
  describe('delete /customers/:id', () => {
    it('204: can delete Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create({ companyId: company.id });
      const del = await request.delete(`${rootPath}/${customer.id}`);
      expect(del.statusCode).toBe(204);

      // confirm cannot get
      const get = await request.get(`${rootPath}/${customer.id}`);
      expect(get.statusCode).toBe(404);
    });

    it('404: cannot delete same Customer twice', async () => {
      const customer: CustomerModelDto = await fake.customer.create();
      const del = await request.delete(`${rootPath}/${customer.id}`);
      expect(del.statusCode).toBe(204);

      const delAgain = await request.delete(`${rootPath}/${customer.id}`);
      expect(delAgain.statusCode).toBe(404);
    });

    it('404: cannot delete non-existent Customer', async () => {
      const customer: CustomerModelDto = await fake.customer.create();
      const nonExistentResourceId = `${customer.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
    });
  });
});
