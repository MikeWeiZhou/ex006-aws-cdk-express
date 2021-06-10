import { ICrudService, IDto, RequestIdDto } from '@ear/common';
import { InternalError, NotFoundError } from '@ear/core';
import { EntityManager, getManager } from 'typeorm';
import { ICreateSaleItemDto } from './dtos';
import { IBatchDeleteSaleItemDto } from './dtos/i-batch-delete-sale-item-dto';
import { SaleItem, SaleItemEntity } from './sale-item-entity';

/**
 * Retrieves and modifies SaleItems.
 */
export class SaleItemService extends ICrudService<SaleItem> {
  /**
   * Constructor.
   */
  constructor() {
    super('sai_');
  }

  /**
   * Create a SaleItem.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: ICreateSaleItemDto, entityManager?: EntityManager): Promise<string> {
    const manager = entityManager ?? getManager();
    const result = await manager.insert(SaleItemEntity, {
      id: await this.generateId(),
      ...createDto,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns a SaleItem.
   * @param idDto contains resource id
   * @param entityManager used for transactions
   * @returns SaleItem or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<SaleItem | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(SaleItemEntity, idDto.id);
  }

  /**
   * Returns a SaleItem or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns SaleItem
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<SaleItem> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve SaleItem. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Not implemented.
   */
  update(updateDto: IDto, entityManager?: EntityManager): Promise<void> {
    throw new InternalError('SaleItemService.update() not implemented.');
  }

  /**
   * Not implemented.
   */
  delete(deleteDto: IDto, entityManager?: EntityManager): Promise<void> {
    throw new InternalError('SaleItemService.delete() not implemented.');
  }

  /**
   * Delete a batch of SaleItems.
   * @param criteriaDto contains delete critera
   * @param entityManager used for transactions
   * @returns number of rows deleted
   */
  async batchDelete(
    criteriaDto: IBatchDeleteSaleItemDto,
    entityManager?: EntityManager,
  ): Promise<number> {
    const manager = entityManager ?? getManager();
    const result = await manager.delete(SaleItemEntity, criteriaDto);
    return result.raw.affectedRows;
  }
}

/**
 * Instance of SaleItemService.
 */
export const saleItemService = new SaleItemService();
