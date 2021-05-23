import { ICrudService, IdDto } from '@ear/common';
import { NotFoundError } from '@ear/core';
import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { ProductCreateDto, ProductListDto, ProductUpdateDto } from './dtos';
import { Product } from './product.model';

/**
 * Service to make changes to Customer resources.
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
   * @param createDto contains fields to insert to database
   * @param entityManager used for transactions
   * @returns resource id
   */
  async create(createDto: ProductCreateDto, entityManager?: EntityManager): Promise<string> {
    const manager = entityManager ?? getManager();
    const result = await manager.insert(Product, {
      id: await this.generateId(),
      ...createDto,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns a Product.
   * @param idDto contains resource id
   * @param entityManager used for transactions
   * @returns Product or undefined if not found
   */
  async get(idDto: IdDto, entityManager?: EntityManager): Promise<Product | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(Product, { id: idDto.id });
  }

  /**
   * Returns a Product or throw an error if not found.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @throws {NotFoundError}
   * @returns Product
   */
  async getOrFail(idDto: IdDto, entityManager?: EntityManager): Promise<Product> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Product. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Product.
   * @param updateDto DTO containing fields needing update
   * @param entityManager used for transactions
   * @throws {NotFoundError}
   */
  async update(updateDto: ProductUpdateDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const { id, ...updates } = updateDto;
    const result = await manager.update(Product, { id }, updates);
    if (result.raw.affectedRows === 0) {
      throw new NotFoundError(`Cannot update Product. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete a Product.
   * @param idDto contains resource id
   * @param entityManager used for transactions
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const result = await manager.delete(Product, { id: idDto.id });
    if (result.raw.affectedRows === 0) {
      throw new NotFoundError(`Cannot delete Product. ID ${idDto.id} does not exist.`);
    }
  }

  /**
   * List all products.
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns list of products
   */
  async list(listDto?: ProductListDto, entityManager?: EntityManager): Promise<Product[]> {
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

    return manager.find(Product, findManyOptions);
  }
}

/**
 * Instance of ProductService.
 */
export const productService = new ProductService();
