import { fake, request, testUtility } from '@ear-tests/core';
import { user } from '@ear-tests/core/faker';
import { CompanyDto } from '@ear/modules/company';
import { CompanyUserDto } from '@ear/modules/company-user';
import { CreateCustomerDto } from '@ear/modules/customer';
import { Response } from 'supertest';

// root url path
const { rootPath } = fake.companyUser;

// use one company for most of tests
let company: CompanyDto;
beforeAll(async () => {
  company = await fake.company.create();
});

// data clean up
afterAll(async () => {
  await fake.companyUser.cleanGarbage();
  await fake.company.cleanGarbage();
});

describe('/company-users', () => {
  /**
   * post /company-users
   */
  describe('post /company-users', () => {
    it('201: can create CompanyUser', async () => {
      // post response identical to create dto
      const createDto = await fake.companyUser.dto({ companyId: company.id });
      const post = await request.post(rootPath).send(createDto);
      expect(post.statusCode).toBe(201);
      expect(post.body).toMatchObject({
        companyId: createDto.companyId,
        user: { email: createDto.user.email },
      } as CompanyUserDto);

      // post response identical to get response
      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject(post.body);

      fake.companyUser.addToGarbageBin(post.body);
    });

    it('409: cannot create CustomerUser with identical email', async () => {
      const companyUser = await fake.companyUser.create({ companyId: company.id });

      // cannot create CompanyUser with duplicate email
      const companyUserDto = await fake.companyUser.dto({
        companyId: company.id,
        user: {
          email: companyUser.user.email,
          password: (await user.dto()).password,
        },
      });
      const post = await request.post(rootPath).send(companyUserDto);
      expect(post.statusCode).toBe(409);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create CompanyUser with missing parameters', async () => {
      let dto: CreateCustomerDto;
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
        'lastName',
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
      delete (dto as any).address.line1;
      delete (dto as any).address.postcode;
      delete (dto as any).address.city;
      delete (dto as any).address.province;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'address.line1',
        'address.postcode',
        'address.city',
        'address.province',
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create Customer with invalid parameters', async () => {
      let dto: CreateCustomerDto;
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
      (dto as any).address.line1 = '';
      (dto as any).address.postcode = '';
      (dto as any).address.city = '';
      (dto as any).address.province = '';
      (dto as any).address.country = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'address.line1',
        'address.postcode',
        'address.city',
        'address.province',
        'address.country',
      ]);
    });

    it('409: cannot create Customer with identical email for same company', async () => {
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
  // describe('get /customers', () => {
  //   const firstNameWith7 = `Rose ${fake.faker.random.alphaNumeric(10)}`;

  //   beforeAll(async () => {
  //     const create = [];
  //     create.push(
  //       ...[1, 2, 3, 4, 5, 6, 7].map(
  //         () => fake.customer.create({ companyId: company.id, firstName: firstNameWith7 }),
  //       ),
  //     );
  //     create.push(
  //       ...[1, 2, 3, 4, 5, 6, 7, 8].map(
  //         () => fake.customer.create({ companyId: company.id }),
  //       ),
  //     );
  //     await Promise.all(create);
  //   });

  //   it('200: can list customers with no filters', async () => {
  //     const get = await request.get(rootPath).send({ companyId: company.id });
  //     expect(get.statusCode).toBe(200);
  //     expect(get.body.length).toBeGreaterThan(7);
  //     // contains expected properties
  //     [
  //       'id',
  //       'firstName',
  //       'lastName',
  //       'email',
  //       'address.line1',
  //       'address.postcode',
  //       'address.city',
  //       'address.province',
  //       'address.country',
  //     ].forEach((param) => expect(get.body[0]).toHaveProperty(param));
  //   });

  //   it('200: can list customers with zero results', async () => {
  //     const createDto = await fake.customer.dto();
  //     const listDto: ListCustomerDto = { companyId: createDto.companyId };
  //     const get = await request.get(rootPath).send(listDto);
  //     expect(get.statusCode).toBe(200);
  //     expect(get.body.length).toBe(0);
  //   });

  //   it('200: can list customers with filters', async () => {
  //     let customer: CustomerDto;
  //     let listDto: ListCustomerDto;
  //     let get: Response;

  //     // results of customers with root filters
  //     customer = await fake.customer.create({ companyId: company.id });
  //     listDto = { email: customer.email };
  //     get = await request.get(rootPath).send(listDto);
  //     expect(get.statusCode).toBe(200);
  //     get.body.forEach((cust: CustomerDto) => {
  //       expect(cust).toHaveProperty('email', listDto.email);
  //     });

  //     // results of customers with nested filters
  //     customer = await fake.customer.create({ companyId: company.id });
  //     listDto = { address: customer.address };
  //     get = await request.get(rootPath).send(listDto);
  //     expect(get.statusCode).toBe(200);
  //     get.body.forEach((cust: CustomerDto) => {
  //       expect(cust).toHaveProperty('address', listDto.address);
  //     });

  //     // results of customers with specified first name (created 7 with identical first name)
  //     listDto = { firstName: firstNameWith7 };
  //     get = await request.get(rootPath).send(listDto);
  //     expect(get.statusCode).toBe(200);
  //     expect(get.body.length).toBe(7);
  //     get.body.forEach((cust: CustomerDto) => {
  //       expect(cust.firstName).toBe(firstNameWith7);
  //     });
  //   });

  //   it('200: can list customers with pagination', async () => {
  //     let get: Response;
  //     let listDto: ListCustomerDto;

  //     // has more than 5 results
  //     get = await request.get(rootPath);
  //     expect(get.body.length).toBeGreaterThan(5);

  //     // limit to 1 result
  //     listDto = { options: { limit: 1, page: 1 } };
  //     get = await request.get(rootPath).send(listDto);
  //     expect(get.body.length).toBe(1);
  //     const firstCustomer = get.body[0];

  //     // second page contains different results from first page
  //     listDto = { options: { limit: 3, page: 2 } };
  //     get = await request.get(rootPath).send(listDto);
  //     expect(get.body.length).toBe(3);
  //     get.body.forEach((customer: CustomerDto) => {
  //       expect(customer.id).not.toBe(firstCustomer.id);
  //     });
  //   });

  //   // eslint-disable-next-line jest/expect-expect
  //   it('400: cannot list customers with invalid filters', async () => {
  //     let listDto: ListCustomerDto;
  //     let get: Response;

  //     // not nullable
  //     listDto = {
  //       companyId: null,
  //       firstName: null,
  //       lastName: null,
  //       email: null,
  //     } as any;
  //     get = await request.get(rootPath).send(listDto);
  //     testUtility.expectRequestInvalidParams(get, [
  //       'companyId',
  //       'firstName',
  //       'lastName',
  //       'email',
  //     ]);

  //     // invalids
  //     listDto = {
  //       companyId: '',
  //       firstName: '',
  //       lastName: '',
  //       email: 'not_an_email',
  //     } as any;
  //     get = await request.get(rootPath).send(listDto);
  //     testUtility.expectRequestInvalidParams(get, [
  //       'companyId',
  //       'firstName',
  //       'lastName',
  //       'email',
  //     ]);
  //   });
  // });
});

// describe('/customers/:id', () => {
//   /**
//    * get /customers/:id
//    */
//   describe('get /customers/:id', () => {
//     it('200: can get Customer', async () => {
//       const customer: CustomerDto = await fake.customer.create({ companyId: company.id });
//       const get = await request.get(`${rootPath}/${customer.id}`);
//       expect(get.statusCode).toBe(200);
//       expect(get.body).toMatchObject(customer);
//     });

//     it('404: cannot get non-existent Customer', async () => {
//       const customer: CustomerDto = await fake.customer.create({ companyId: company.id });
//       const nonExistentResourceId = `${customer.id.slice(0, -3)}abc`;
//       const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
//       expect(get.statusCode).toBe(404);
//     });
//   });

//   /**
//    * patch /customers/:id
//    */
//   describe('patch /customers/:id', () => {
//     it('200: can update Customer', async () => {
//       const customer: CustomerDto = await fake.customer.create({ companyId: company.id });
//       const dto: CreateCustomerDto = await fake.customer.dto({ companyId: company.id });

//       const update: UpdateCustomerDto = {
//         ...dto,
//         id: customer.id,
//       };
//       const patch = await request.patch(`${rootPath}/${customer.id}`).send(update);
//       expect(patch.statusCode).toBe(200);
//       expect(patch.body).toMatchObject({
//         ...update,
//         id: customer.id,
//       });
//     });

//     // eslint-disable-next-line jest/expect-expect
//     it('400: cannot update customer with invalid parameters', async () => {
//       const customer: CustomerDto = await fake.customer.create({ companyId: company.id });
//       let dto: UpdateCustomerDto;
//       let patch: Response;

//       // not nullable
//       dto = {
//         firstName: null,
//         lastName: null,
//         email: null,
//       } as any;
//       patch = await request.patch(`${rootPath}/${customer.id}`).send(dto);
//       testUtility.expectRequestInvalidParams(patch, [
//         'firstName',
//         'lastName',
//         'email',
//       ]);

//       // invalids
//       dto = {
//         firstName: '',
//         lastName: '',
//         email: 'not_an_email',
//       } as any;
//       patch = await request.patch(`${rootPath}/${customer.id}`).send(dto);
//       testUtility.expectRequestInvalidParams(patch, [
//         'firstName',
//         'lastName',
//         'email',
//       ]);
//     });

//     it('404: cannot update non-existent Customer', async () => {
//       const customer: CustomerDto = await fake.customer.create({ companyId: company.id });
//       const nonExistentId = `${customer.id.slice(0, -3)}abc`;
//       const patch = await request.patch(`${rootPath}/${nonExistentId}`);
//       expect(patch.statusCode).toBe(404);
//     });

//     it('409: cannot update Customer leading to duplicate email', async () => {
//       const original: CustomerDto = await fake.customer.create({ companyId: company.id });
//       const another: CustomerDto = await fake.customer.create({ companyId: company.id });

//       // duplicate email
//       const update: Partial<UpdateCustomerDto> = { email: another.email };
//       const patch = await request.patch(`${rootPath}/${original.id}`).send(update);
//       expect(patch.statusCode).toBe(409);
//       expect(patch.body.status).toBe(409);

//       // confirm no change
//       const get = await request.get(`${rootPath}/${original.id}`);
//       expect(get.body).toMatchObject(original);
//     });
//   });

//   /**
//    * delete /customers/:id
//    */
//   describe('delete /customers/:id', () => {
//     it('204: can delete Customer', async () => {
//       const customer: CustomerDto = await fake.customer.create({ companyId: company.id });
//       const del = await request.delete(`${rootPath}/${customer.id}`);
//       expect(del.statusCode).toBe(204);

//       // confirm cannot get
//       const get = await request.get(`${rootPath}/${customer.id}`);
//       expect(get.statusCode).toBe(404);
//     });

//     it('404: cannot delete same Customer twice', async () => {
//       const customer: CustomerDto = await fake.customer.create();
//       const del = await request.delete(`${rootPath}/${customer.id}`);
//       expect(del.statusCode).toBe(204);

//       const delAgain = await request.delete(`${rootPath}/${customer.id}`);
//       expect(delAgain.statusCode).toBe(404);
//     });

//     it('404: cannot delete non-existent Customer', async () => {
//       const customer: CustomerDto = await fake.customer.create();
//       const nonExistentResourceId = `${customer.id.slice(0, -3)}abc`;
//       const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
//       expect(get.statusCode).toBe(404);
//     });
//   });
// });
