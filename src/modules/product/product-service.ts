import { ICrudService, RequestIdDto, ServiceUpdateOverwrite } from '@ear/common';
import { NotFoundError } from '@ear/core';
import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto, ListProductDto, UpdateProductDto } from './dtos';
import { Product, ProductEntity } from './product-entity';

/**
 * Retrieves and modifies Products.
 */
export class ProductService extends ICrudService<Product> {
  /**
   * Constructor.
   */
  constructor() {
    super('pro_');
  }

  /**
   * Create a Product.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: CreateProductDto, entityManager?: EntityManager): Promise<string> {
    const manager = entityManager ?? getManager();
    const result = await manager.insert(ProductEntity, {
      id: await this.generateId(),
      ...createDto,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns a Product.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Product or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Product | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(ProductEntity, { id: idDto.id });
  }

  /**
   * Returns a Product or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Product
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Product> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Product. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Product.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateOverwrite<Product, UpdateProductDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = entityManager ?? getManager();
    const { id, ...updates } = updateDto;
    const result = await manager.update(ProductEntity, { id }, updates);
    if (result.raw.affectedRows === 0) {
      throw new NotFoundError(`Cannot update Product. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete a Product.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const result = await manager.delete(ProductEntity, { id: idDto.id });
    if (result.raw.affectedRows === 0) {
      throw new NotFoundError(`Cannot delete Product. ID ${idDto.id} does not exist.`);
    }
  }

  /**
   * List Products
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns Products
   */
  async list(listDto?: ListProductDto, entityManager?: EntityManager): Promise<Product[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Product> = {};

    if (listDto) {
      const { options, ...filters } = listDto;

      // filters
      findManyOptions.where = (qb: SelectQueryBuilder<Product>) => {
        this.buildListWhereClause(qb, 'Product', filters);
      };

      // pagination
      if (typeof options?.limit !== 'undefined') {
        findManyOptions.take = options?.limit;
        if (typeof options?.page !== 'undefined') {
          findManyOptions.skip = (options?.page - 1) * options?.limit;
        }
      }
    }

    return manager.find(ProductEntity, findManyOptions);
  }
}

/**
 * Instance of ProductService.
 */
export const productService = new ProductService();
