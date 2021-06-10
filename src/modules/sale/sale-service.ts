import { ICrudService, RequestIdDto, ServiceUpdateType } from '@ear/common';
import { InvalidRequestError, NotFoundError } from '@ear/core';
import { saleItemService } from '@ear/modules/sale-item';
import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { productService } from '../product';
import { CreateSaleDto, ListSaleDto, UpdateSaleDto } from './dtos';
import { Sale, SaleEntity } from './sale-entity';
import { SaleStatusCode } from './types';

/**
 * Service to make changes to Sale resources.
 */
export class SaleService extends ICrudService<Sale> {
  /**
   * Constructor.
   */
  constructor() {
    super('sal_');
  }

  /**
   * Create a Sale.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: CreateSaleDto, entityManager?: EntityManager): Promise<string> {
    return ICrudService.transaction(async (manager) => {
      const { saleItems, ...saleInfo } = createDto;
      const saleId = await this.generateId();

      // validate all products belong to Customer's Company
      const productIds = saleItems.map((saleItem) => saleItem.productId);
      const companyIds = await productService.getProductCompanyIds(productIds);
      if (companyIds.length !== 1) {
        throw new InvalidRequestError(undefined, 'Cannot create Sale. Products must belong only to a single Company.');
      }
      if (companyIds[0] !== saleInfo.companyId) {
        throw new InvalidRequestError(undefined, 'Cannot create Sale. Products must belong same Company as Customer.');
      }

      // calculate Sale total
      const saleTotal = saleItems.reduce((total, saleItem) => total + saleItem.total, 0);

      // create Sale
      const result = await manager.insert(SaleEntity, {
        id: saleId,
        statusCode: SaleStatusCode.CREATED,
        total: saleTotal,
        ...saleInfo,
      });

      // create SaleItems
      const createSaleItems = saleItems.map(async (saleItem) => saleItemService.create({
        saleId,
        productId: saleItem.productId,
        quantity: saleItem.quantity,
        pricePerUnit: saleItem.pricePerUnit,
        total: saleItem.total,
      }, manager));
      await Promise.all(createSaleItems);

      // return Sale ID
      return result.identifiers[0].id;
    }, entityManager);
  }

  /**
   * Returns a Sale.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Sale or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Sale | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(
      SaleEntity,
      idDto.id,
      { relations: ['saleItems'] },
    );
  }

  /**
   * Returns a Sale or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Sale
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Sale> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Sale. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Sale.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateType<Sale, UpdateSaleDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = entityManager ?? getManager();
    const { id, ...updates } = updateDto;
    const result = await manager.update(SaleEntity, id, updates);
    if (result.raw.affectedRows !== 1) {
      throw new NotFoundError(`Cannot update Sale. ID ${id} does not exist.`);
    }
  }

  /**
   * Cancel a Sale.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async cancel(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const sale = await this.getOrFail(idDto, manager);
      if (sale.statusCode !== SaleStatusCode.CREATED) {
        throw new InvalidRequestError(undefined, `Cannot cancel sale '${idDto.id}', it's status is not '${SaleStatusCode.CREATED}'.`);
      }
      await this.update({
        id: idDto.id,
        statusCode: SaleStatusCode.CANCELLED,
      }, manager);
    }, entityManager);
  }

  /**
   * Pay for a Sale.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async pay(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const sale = await this.getOrFail(idDto, manager);
      if (sale.statusCode !== SaleStatusCode.CREATED) {
        throw new InvalidRequestError(undefined, `Cannot pay for sale '${idDto.id}', it's status is not '${SaleStatusCode.CREATED}'.`);
      }
      await this.update({
        id: idDto.id,
        statusCode: SaleStatusCode.PAID,
      }, manager);
    }, entityManager);
  }

  /**
   * Refund a sale.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async refund(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const sale = await this.getOrFail(idDto, manager);
      if (sale.statusCode !== SaleStatusCode.PAID) {
        throw new InvalidRequestError(undefined, `Cannot refund sale '${idDto.id}', it's status is not '${SaleStatusCode.PAID}'.`);
      }
      await this.update({
        id: idDto.id,
        statusCode: SaleStatusCode.REFUNDED,
      }, manager);
    }, entityManager);
  }

  /**
   * Delete a Sale.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      await saleItemService.batchDelete({ saleId: idDto.id }, manager);
      const result = await manager.delete(SaleEntity, idDto.id);
      if (result.raw.affectedRows !== 1) {
        throw new NotFoundError(`Cannot delete Sale. ID ${idDto.id} does not exist.`);
      }
    }, entityManager);
  }

  /**
   * List Sales.
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns Sales
   */
  async list(listDto?: ListSaleDto, entityManager?: EntityManager): Promise<Sale[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Sale> = {
      relations: ['saleItems'],
    };

    if (listDto) {
      const { options, ...filters } = listDto;

      // filters
      findManyOptions.where = (qb: SelectQueryBuilder<Sale>) => {
        this.buildListWhereClause(qb, 'Sale', filters);
      };

      // pagination
      if (typeof options?.limit !== 'undefined') {
        findManyOptions.take = options?.limit;
        if (typeof options?.page !== 'undefined') {
          findManyOptions.skip = (options?.page - 1) * options?.limit;
        }
      }
    }

    return manager.find(SaleEntity, findManyOptions);
  }
}

/**
 * Instance of SaleService.
 */
export const saleService = new SaleService();
