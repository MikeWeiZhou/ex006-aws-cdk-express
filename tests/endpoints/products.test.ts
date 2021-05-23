import { fake, request, testUtility } from '@ear-tests/core';
import { CompanyModelDto } from '@ear/modules/company/dtos';
import { CustomerModelDto } from '@ear/modules/customer/dtos';
import { ProductCreateDto, ProductListDto, ProductModelDto, ProductUpdateDto } from '@ear/modules/product/dtos';
import { Response } from 'supertest';

// root url path
const { rootPath } = fake.product;

// use one company for most of tests
let company: CompanyModelDto;
beforeAll(async () => {
  company = await fake.company.create();
});

// data clean up
afterAll(async () => {
  await fake.product.cleanGarbage();
  await fake.company.cleanGarbage();
});

describe('/products', () => {
  /**
   * post /products
   */
  describe('post /products', () => {
    it('201: can create Product', async () => {
      // post response identical to create dto
      const createDto = await fake.product.dto({ companyId: company.id });
      const post = await request.post(rootPath).send(createDto);
      expect(post.statusCode).toBe(201);
      expect(post.body).toMatchObject(createDto);

      // post response identical to get response
      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject(post.body);

      fake.product.addToGarbageBin(post.body);
    });

    // eslint-disable-next-line jest/expect-expect
    it('201: can create Product with lowest/greatest possible price', async () => {
      let dto: ProductCreateDto;
      let post: Response;

      // price upper bound
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).price = 99999999;
      post = await request.post(rootPath).send(dto);
      expect(post.statusCode).toBe(201);
      fake.product.addToGarbageBin(post.body);

      // price lower bound
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).price = 0;
      post = await request.post(rootPath).send(dto);
      expect(post.statusCode).toBe(201);
      fake.product.addToGarbageBin(post.body);
    });

    it('201: can create Product with identical sku for different company', async () => {
      const product = await fake.product.create();

      // same sku, different company
      const productDto = await fake.product.dto({ sku: product.sku });
      const post = await request.post(rootPath).send(productDto);
      expect(post.statusCode).toBe(201);

      fake.product.addToGarbageBin(post.body);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create Product with missing parameters', async () => {
      let dto: ProductCreateDto;
      let post: Response;

      // missing parameters
      dto = await fake.product.dto({ companyId: company.id });
      delete (dto as any).companyId;
      delete (dto as any).name;
      delete (dto as any).sku;
      delete (dto as any).price;
      delete (dto as any).currency;
      delete (dto as any).description; // optional
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'companyId',
        'name',
        'sku',
        'price',
        'currency',
      ]);

      // undefined should be treated as missing
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).companyId = undefined;
      (dto as any).name = undefined;
      (dto as any).sku = undefined;
      (dto as any).price = undefined;
      (dto as any).currency = undefined;
      (dto as any).description = undefined; // optional
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'companyId',
        'name',
        'sku',
        'price',
        'currency',
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create Product with invalid parameters', async () => {
      let dto: ProductCreateDto;
      let post: Response;

      // all invalid
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).companyId = '';
      (dto as any).name = '';
      (dto as any).sku = '';
      (dto as any).price = '50';
      (dto as any).currency = 'uad';
      (dto as any).description = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'companyId',
        'name',
        'sku',
        'price',
        'currency',
        'description',
      ]);

      // mostly valid
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).name = 'Mars Bar'; // valid
      (dto as any).sku = '100-19920-01'; // valid
      (dto as any).price = '50';
      (dto as any).currency = 'usd'; // valid
      (dto as any).description = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'price',
        'description',
      ]);

      // nulls are invalid
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).companyId = null;
      (dto as any).name = null;
      (dto as any).sku = null;
      (dto as any).price = null;
      (dto as any).currency = null;
      (dto as any).description = null; // nullable, this should not error out
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'companyId',
        'name',
        'sku',
        'price',
        'currency',
      ]);

      // price just out of accepted range
      dto = await fake.product.dto({ companyId: company.id });
      (dto as any).price = -1;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, ['price']);
      (dto as any).price = 100000000;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, ['price']);
    });

    it('409: cannot create Product with identical sku for same company', async () => {
      const product1Dto = await fake.product.dto({ companyId: company.id });
      const post1 = await request.post(rootPath).send(product1Dto);
      expect(post1.statusCode).toBe(201);
      expect(post1.body).toMatchObject(product1Dto);

      // no duplicate sku for same company
      const product2Dto = await fake.product.dto({
        companyId: company.id,
        sku: product1Dto.sku,
      });
      const post2 = await request.post(rootPath).send(product2Dto);
      expect(post2.statusCode).toBe(409);
      expect(post2.body.status).toBe(409);

      fake.product.addToGarbageBin(post1.body);
    });
  });

  /**
   * get /products
   */
  describe('get /products', () => {
    const nameWith7 = `Rose ${fake.faker.random.alphaNumeric(10)}`;

    beforeAll(async () => {
      const create = [];
      create.push(
        ...[1, 2, 3, 4, 5, 6, 7].map(
          () => fake.product.create({ companyId: company.id, name: nameWith7 }),
        ),
      );
      create.push(
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(
          () => fake.product.create({ companyId: company.id }),
        ),
      );
      await Promise.all(create);
    });

    it('200: can list products with no filters', async () => {
      const get = await request.get(rootPath).send({ companyId: company.id });
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBeGreaterThan(7);
      // contains expected properties
      [
        'id',
        'name',
        'description',
        'sku',
        'price',
        'currency',
      ].forEach((param) => expect(get.body[0]).toHaveProperty(param));
    });

    it('200: can list products with zero results', async () => {
      const createDto = await fake.product.dto();
      const listDto: ProductListDto = { companyId: createDto.companyId };
      const get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(0);
    });

    it('200: can list products with filters', async () => {
      let product: ProductModelDto;
      let listDto: ProductListDto;
      let get: Response;

      // filtering by sku
      product = await fake.product.create({ companyId: company.id });
      listDto = { sku: product.sku };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      get.body.forEach((prod: ProductModelDto) => {
        expect(prod).toHaveProperty('sku', listDto.sku);
      });

      // filtering by companyId
      product = await fake.product.create({ companyId: company.id });
      listDto = { companyId: product.companyId };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      get.body.forEach((prod: ProductModelDto) => {
        expect(prod).toHaveProperty('companyId', listDto.companyId);
      });

      // filter by name (created 7 products with identical name)
      listDto = { name: nameWith7 };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(7);
      get.body.forEach((prod: ProductModelDto) => {
        expect(prod.name).toBe(nameWith7);
      });
    });

    it('200: can list products with pagination', async () => {
      let get: Response;
      let listDto: ProductListDto;

      // has more than 5 results
      get = await request.get(rootPath);
      expect(get.body.length).toBeGreaterThan(5);

      // limit to 1 result
      listDto = { options: { limit: 1, page: 1 } };
      get = await request.get(rootPath).send(listDto);
      expect(get.body.length).toBe(1);
      const firstProduct = get.body[0];

      // second page contains different results from first page
      listDto = { options: { limit: 3, page: 2 } };
      get = await request.get(rootPath).send(listDto);
      expect(get.body.length).toBe(3);
      get.body.forEach((customer: CustomerModelDto) => {
        expect(customer.id).not.toBe(firstProduct.id);
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot list products with invalid filters', async () => {
      let listDto: ProductListDto;
      let get: Response;

      // not nullable
      listDto = {
        companyId: null,
        currency: null,
        description: null, // this is nullable, this should not error out
        name: null,
        price: null,
        sku: null,
        options: null,
      } as any;
      get = await request.get(rootPath).send(listDto);
      testUtility.expectRequestInvalidParams(get, [
        'companyId',
        'currency',
        'name',
        'price',
        'sku',
        'options',
      ]);

      // invalids
      listDto = {
        companyId: '',
        currency: 'aud', // not a supported currency
        description: '',
        name: '',
        price: -1, // minimum 0
        sku: '',
        options: '',
      } as any;
      get = await request.get(rootPath).send(listDto);
      testUtility.expectRequestInvalidParams(get, [
        'companyId',
        'currency',
        'description',
        'name',
        'price',
        'sku',
        'options',
      ]);
    });
  });
});

describe('/products/:id', () => {
  /**
   * get /products/:id
   */
  describe('get /products/:id', () => {
    it('200: can get Product', async () => {
      const product: ProductModelDto = await fake.product.create({ companyId: company.id });
      const get = await request.get(`${rootPath}/${product.id}`);
      expect(get.statusCode).toBe(200);
      expect(get.body).toMatchObject(product);
    });

    it('404: cannot get non-existent Product', async () => {
      const product: ProductModelDto = await fake.product.create({ companyId: company.id });
      const nonExistentResourceId = `${product.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
    });
  });

  /**
   * patch /products/:id
   */
  describe('patch /products/:id', () => {
    it('200: can update Product', async () => {
      const product: ProductModelDto = await fake.product.create({ companyId: company.id });
      const dto: ProductCreateDto = await fake.product.dto({ companyId: company.id });

      const update: ProductUpdateDto = {
        ...dto,
        id: product.id,
      };
      const patch = await request.patch(`${rootPath}/${product.id}`).send(update);
      expect(patch.statusCode).toBe(200);
      expect(patch.body).toMatchObject({
        ...update,
        id: product.id,
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot update Product with invalid parameters', async () => {
      const product: ProductModelDto = await fake.product.create({ companyId: company.id });
      let dto: ProductUpdateDto;
      let patch: Response;

      // not nullable
      dto = {
        currency: null,
        description: null, // this is nullable, this should not error out
        name: null,
        price: null,
        sku: null,
      } as any;
      patch = await request.patch(`${rootPath}/${product.id}`).send(dto);
      testUtility.expectRequestInvalidParams(patch, [
        'currency',
        'name',
        'price',
        'sku',
      ]);

      // invalids
      dto = {
        currency: 'son', // not supported currency
        description: '', // optional, but contains invalid value, should error out
        name: '',
        price: 10000000000, // way over the limit
        sku: '',
      } as any;
      patch = await request.patch(`${rootPath}/${product.id}`).send(dto);
      testUtility.expectRequestInvalidParams(patch, [
        'currency',
        'description',
        'name',
        'price',
        'sku',
      ]);
    });

    it('404: cannot update non-existent Product', async () => {
      const product: ProductModelDto = await fake.product.create({ companyId: company.id });
      const nonExistentId = `${product.id.slice(0, -3)}abc`;
      const patch = await request.patch(`${rootPath}/${nonExistentId}`);
      expect(patch.statusCode).toBe(404);
    });

    it('409: cannot update Product leading to duplicate sku', async () => {
      const original: ProductModelDto = await fake.product.create({ companyId: company.id });
      const another: ProductModelDto = await fake.product.create({ companyId: company.id });

      // duplicate sku
      const update: Partial<ProductUpdateDto> = { sku: another.sku };
      const patch = await request.patch(`${rootPath}/${original.id}`).send(update);
      expect(patch.statusCode).toBe(409);
      expect(patch.body.status).toBe(409);

      // confirm no change
      const get = await request.get(`${rootPath}/${original.id}`);
      expect(get.body).toMatchObject(original);
    });
  });

  /**
   * delete /products/:id
   */
  describe('delete /products/:id', () => {
    it('204: can delete Product', async () => {
      const product: ProductModelDto = await fake.product.create({ companyId: company.id });
      const del = await request.delete(`${rootPath}/${product.id}`);
      expect(del.statusCode).toBe(204);

      // confirm cannot get
      const get = await request.get(`${rootPath}/${product.id}`);
      expect(get.statusCode).toBe(404);
    });

    it('404: cannot delete same Product twice', async () => {
      const product: ProductModelDto = await fake.product.create();
      const del = await request.delete(`${rootPath}/${product.id}`);
      expect(del.statusCode).toBe(204);

      const delAgain = await request.delete(`${rootPath}/${product.id}`);
      expect(delAgain.statusCode).toBe(404);
    });

    it('404: cannot delete non-existent Product', async () => {
      const product: ProductModelDto = await fake.product.create();
      const nonExistentResourceId = `${product.id.slice(0, -3)}abc`;
      const get = await request.get(`${rootPath}/${nonExistentResourceId}`);
      expect(get.statusCode).toBe(404);
    });
  });
});
