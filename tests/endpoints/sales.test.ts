import { fake, request, testUtility } from '@ear-tests/core';
import { CompanyDto } from '@ear/modules/company';
import { CustomerDto } from '@ear/modules/customer';
import { ProductDto } from '@ear/modules/product';
import { CreateSaleDto, ListSaleDto, SaleDto, saleService, SaleStatusCode, UpdateSaleDto } from '@ear/modules/sale';
import { NestedCreateSaleItemDto } from '@ear/modules/sale-item';
import { Response } from 'supertest';

// root url path
const { rootPath } = fake.sale;

// use one customer for most of tests
let company: CompanyDto;
let product: ProductDto;
let customer: CustomerDto;
let saleItems: NestedCreateSaleItemDto[];
beforeAll(async () => {
  company = await fake.company.create();
  product = await fake.product.create({ companyId: company.id });
  customer = await fake.customer.create({ companyId: company.id });
  saleItems = [await fake.saleItem.dto({ productId: product.id })];
});

// data clean up
afterAll(async () => {
  await fake.sale.cleanGarbage();
});

describe('/sales', () => {
  /**
   * post /sales
   */
  describe('post /sales', () => {
    it('201: can create sale', async () => {
      // post response identical to create dto
      const createDto = await fake.sale.dto({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const post = await request.post(rootPath).send(createDto);
      expect(post.statusCode).toBe(201);
      expect(post.body).toMatchObject(createDto);

      // post response identical to get response
      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject(post.body);

      fake.sale.addToGarbageBin(post.body);
    });

    it('201: can create sale with correct total cost', async () => {
      const createDto = await fake.sale.dto({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const total = saleItems.reduce((saleTotal, saleItem) => saleTotal + saleItem.total, 0);
      const post = await request.post(rootPath).send(createDto);
      expect(post.statusCode).toBe(201);
      expect(post.body.total).toBe(total);

      // post response identical to get response
      const get = await request.get(`${rootPath}/${post.body.id}`);
      expect(get.body).toMatchObject(post.body);

      fake.sale.addToGarbageBin(post.body);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create sale with missing parameters', async () => {
      let customSaleItems: NestedCreateSaleItemDto[];
      let dto: CreateSaleDto;
      let post: Response;

      // missing root-level parameters and object
      dto = await fake.sale.dto({ customerId: customer.id, saleItems });
      delete (dto as any).companyId;
      delete (dto as any).customerId;
      delete (dto as any).saleItems;
      delete (dto as any).comments; // optional
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'companyId',
        'customerId',
        'saleItems',
      ]);

      // missing nested parameters
      customSaleItems = JSON.parse(JSON.stringify(saleItems));
      dto = await fake.sale.dto({ customerId: customer.id, saleItems: customSaleItems });
      delete (dto as any).saleItems[0].productId;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'saleItems.0.productId',
      ]);
      // missing nested parameters
      customSaleItems = JSON.parse(JSON.stringify(saleItems));
      dto = await fake.sale.dto({ customerId: customer.id, saleItems: customSaleItems });
      delete (dto as any).saleItems[0].quantity;
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'saleItems.0.quantity',
      ]);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot create sale with invalid parameters', async () => {
      let dto: CreateSaleDto;
      let post: Response;

      // invalid root-level parameters and object
      dto = await fake.sale.dto({ customerId: customer.id, saleItems });
      (dto as any).companyId = '';
      (dto as any).customerId = '';
      (dto as any).saleItems = '';
      (dto as any).comments = ''; // optional, but is invalid
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'companyId',
        'customerId',
        'saleItems',
        'comments',
      ]);

      // invalid nested parameters
      const customSaleItems: NestedCreateSaleItemDto[] = JSON.parse(JSON.stringify(saleItems));
      dto = await fake.sale.dto({ customerId: customer.id, saleItems: customSaleItems });
      (dto as any).saleItems[0].productId = '';
      (dto as any).saleItems[0].quantity = '';
      post = await request.post(rootPath).send(dto);
      testUtility.expectRequestInvalidParams(post, [
        'saleItems.0.quantity',
        'saleItems.0.productId',
      ]);
    });

    it('409: cannot create sale with two identical product in saleitems', async () => {
      const saleItem1 = await fake.saleItem.dto({ productId: saleItems[0].productId });
      const saleItem2 = await fake.saleItem.dto({ productId: saleItem1.productId });
      const saleDto = await fake.sale.dto({
        companyId: company.id,
        customerId: customer.id,
        saleItems: [saleItem1, saleItem2],
      });
      const post = await request.post(rootPath).send(saleDto);
      expect(post.statusCode).toBe(409);
    });

    it('409: cannot create sale with products that belongs to a different company', async () => {
      const company1 = company;
      const company2 = await fake.company.create();
      const product1 = await fake.product.create({ companyId: company1.id });
      const product2 = await fake.product.create({ companyId: company2.id });
      const saleItem1 = await fake.saleItem.dto({ productId: product1.id });
      const saleItem2 = await fake.saleItem.dto({ productId: product2.id });
      const saleDto = await fake.sale.dto({
        customerId: customer.id,
        saleItems: [saleItem1, saleItem2],
      });
      const post = await request.post(rootPath).send(saleDto);
      expect(post.statusCode).toBe(400);
    });

    it('409: cannot create sale with product that customer does not have access to', async () => {
      const company2 = await fake.company.create();
      const product2 = await fake.product.create({ companyId: company2.id });
      const saleItem2 = await fake.saleItem.dto({ productId: product2.id });
      const saleDto = await fake.sale.dto({
        customerId: customer.id,
        saleItems: [saleItem2],
      });
      const post = await request.post(rootPath).send(saleDto);
      expect(post.statusCode).toBe(400);
    });
  });

  /**
   * get /sales
   */
  describe('get /sales', () => {
    beforeAll(async () => {
      const create = [];
      // base sales
      create.push(
        ...[1, 2, 3].map(
          () => fake.sale.create({ customerId: customer.id, saleItems }),
        ),
      );
      await Promise.all(create);
    });

    // eslint-disable-next-line jest/expect-expect
    it('200: can list sales with no filters', async () => {
      const get = await request.get(rootPath).send();
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBeGreaterThan(3);
      // contains expected properties
      [
        'id',
        'total',
        'comments',
        'companyId',
        'customerId',
        'saleItems.0.quantity',
        'saleItems.0.pricePerUnit',
        'saleItems.0.total',
        'saleItems.0.productId',
      ].forEach((param) => expect(get.body[0]).toHaveProperty(param));
    });

    it('200: can list sales with zero results', async () => {
      const createDto = await fake.sale.dto(undefined, true);
      const listDto: ListSaleDto = { customerId: createDto.customerId };
      const get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBe(0);
    });

    it('200: can list sales with filters', async () => {
      let createdSale: SaleDto;
      let listDto: ListSaleDto;
      let get: Response;

      // results of sales with root filters
      createdSale = await fake.sale.create();
      listDto = { customerId: createdSale.customerId };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBeGreaterThanOrEqual(1);
      get.body.forEach((sal: SaleDto) => {
        expect(sal).toHaveProperty('customerId', listDto.customerId);
      });

      // results of sales with root filters
      createdSale = await fake.sale.create();
      listDto = { companyId: createdSale.companyId };
      get = await request.get(rootPath).send(listDto);
      expect(get.statusCode).toBe(200);
      expect(get.body.length).toBeGreaterThanOrEqual(1);
      get.body.forEach((sal: SaleDto) => {
        expect(sal).toHaveProperty('companyId', listDto.companyId);
      });
    });

    it('200: can list sales with pagination', async () => {
      let get: Response;
      let listDto: ListSaleDto;

      // has more than 5 results
      get = await request.get(rootPath);
      expect(get.body.length).toBeGreaterThan(5);

      // limit to 1 result
      listDto = { options: { limit: 1, page: 1 } };
      get = await request.get(rootPath).send(listDto);
      expect(get.body.length).toBe(1);
      const firstSale = get.body[0];

      // second page contains different results from first page
      listDto = { options: { limit: 3, page: 2 } };
      get = await request.get(rootPath).send(listDto);
      expect(get.body.length).toBe(3);
      get.body.forEach((sale: SaleDto) => {
        expect(sale.id).not.toBe(firstSale.id);
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot list sales with invalid filters', async () => {
      let listDto: ListSaleDto;
      let get: Response;

      // not nullable
      listDto = {
        companyId: null,
        customerId: null,
        statusCode: null,
        comments: null, // optional
      } as any;
      get = await request.get(rootPath).send(listDto);
      testUtility.expectRequestInvalidParams(get, [
        'companyId',
        'customerId',
        'statusCode',
      ]);

      // invalids
      listDto = {
        companyId: '',
        customerId: '',
        statusCode: '',
        comments: '', // optional, but cannot be empty
      } as any;
      get = await request.get(rootPath).send(listDto);
      testUtility.expectRequestInvalidParams(get, [
        'companyId',
        'customerId',
        'statusCode',
        'comments',
      ]);
    });
  });
});

describe('/sales/:id', () => {
  /**
   * get /sales/:id
   */
  describe('get /sales/:id', () => {
    it('200: can get sale', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const get = await request.get(`${rootPath}/${sale.id}`);
      expect(get.statusCode).toBe(200);
      expect(get.body).toMatchObject(sale);
    });

    it('404: cannot get non-existent sale', async () => {
      const saleId = await saleService.generateId();
      const get = await request.get(`${rootPath}/${saleId}`);
      expect(get.statusCode).toBe(404);
    });
  });

  /**
   * patch /sales/:id
   */
  describe('patch /sales/:id', () => {
    it('200: can update sale comments', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const update: Partial<UpdateSaleDto> = {
        comments: 'Deliver to backdoor.',
        id: sale.id,
      };
      const patch = await request.patch(`${rootPath}/${sale.id}`).send(update);
      expect(patch.statusCode).toBe(200);
      expect(patch.body).toMatchObject(update);
    });

    // eslint-disable-next-line jest/expect-expect
    it('400: cannot update sale with invalid comments', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const update: Partial<UpdateSaleDto> = {
        comments: '',
        id: sale.id,
      };
      const patch = await request.patch(`${rootPath}/${sale.id}`).send(update);
      testUtility.expectRequestInvalidParams(patch, [
        'comments',
      ]);
    });
  });

  /**
   * delete /sales/:id
   */
  describe('delete /sales/:id', () => {
    it('204: can delete sale', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const del = await request.del(`${rootPath}/${sale.id}`);
      expect(del.statusCode).toBe(204);

      const get = await request.get(`${rootPath}/${sale.id}`);
      expect(get.statusCode).toBe(404);
    });

    it('404: cannot delete same sale twice', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      const del = await request.del(`${rootPath}/${sale.id}`);
      expect(del.statusCode).toBe(204);

      const delAgain = await request.del(`${rootPath}/${sale.id}`);
      expect(delAgain.statusCode).toBe(404);
    });

    it('404: cannot delete non-existent sale', async () => {
      const saleId = await saleService.generateId();
      const del = await request.del(`${rootPath}/${saleId}`);
      expect(del.statusCode).toBe(404);
    });
  });
});

describe('/sales/:id/cancel', () => {
  describe('post /sales/:id/cancel', () => {
    it('200: can cancel a sale with status CREATED', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      const post = await request.post(`${rootPath}/${sale.id}/cancel`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.CANCELLED);
    });

    it('400: cannot cancel a sale with status PAID', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // paid
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);

      // cannot cancel
      post = await request.post(`${rootPath}/${sale.id}/cancel`);
      expect(post.statusCode).toBe(400);
    });

    it('400: cannot cancel a sale with status REFUNDED', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // paid
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);

      // refunded
      post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.REFUNDED);

      // cannot cancel
      post = await request.post(`${rootPath}/${sale.id}/cancel`);
      expect(post.statusCode).toBe(400);
    });
  });
});

describe('/sales/:id/pay', () => {
  describe('post /sales/:id/pay', () => {
    it('200: can pay for a sale with status CREATED', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      const post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);
    });

    it('400: cannot pay for a sale with status CANCELLED', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // cancelled
      post = await request.post(`${rootPath}/${sale.id}/cancel`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.CANCELLED);

      // cannot pay
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(400);
    });

    it('400: cannot pay for a sale with status PAID', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // paid
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);

      // cannot pay
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(400);
    });

    it('400: cannot pay for a sale with status REFUNDED', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // paid
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);

      // refunded
      post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.REFUNDED);

      // cannot pay
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(400);
    });
  });
});

describe('/sales/:id/refund', () => {
  describe('post /sales/:id/refund', () => {
    it('200: can refund a sale with status PAID', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // paid
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);

      // refunded
      post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.REFUNDED);
    });

    it('400: cannot refund a sale with status CREATED', async () => {
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      const post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(400);
    });

    it('400: cannot refund a sale with status CANCELLED', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // cancelled
      post = await request.post(`${rootPath}/${sale.id}/cancel`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.CANCELLED);

      // cannot refund
      post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(400);
    });

    it('400: cannot refund a sale with status REFUNDED', async () => {
      let post: Response;

      // created
      const sale = await fake.sale.create({
        companyId: company.id,
        customerId: customer.id,
        saleItems,
      });
      expect(sale.statusCode).toBe(SaleStatusCode.CREATED);

      // paid
      post = await request.post(`${rootPath}/${sale.id}/pay`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.PAID);

      // refunded
      post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(200);
      expect(post.body.statusCode).toBe(SaleStatusCode.REFUNDED);

      // cannot refund second time
      post = await request.post(`${rootPath}/${sale.id}/refund`);
      expect(post.statusCode).toBe(400);
    });
  });
});
