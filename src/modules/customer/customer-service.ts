import { ICrudService, RequestIdDto, ServiceUpdateOverwrite } from '@ear/common';
import { NotFoundError } from '@ear/core';
import { addressService } from '@ear/modules/address';
import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { Customer, CustomerEntity } from './customer-entity';
import { CreateCustomerDto, ListCustomerDto, UpdateCustomerDto } from './dtos';

/**
 * Retrieves and modifies Companies.
 */
export class CustomerService extends ICrudService<Customer> {
  /**
   * Constructor.
   */
  constructor() {
    super('cus_');
  }

  /**
   * Create a Customer.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: CreateCustomerDto, entityManager?: EntityManager): Promise<string> {
    return ICrudService.transaction(async (manager) => {
      const { address, ...customerInfo } = createDto;
      const addressId = await addressService.create(address, manager);
      const result = await manager.insert(CustomerEntity, {
        id: await this.generateId(),
        addressId,
        ...customerInfo,
      });
      return result.identifiers[0].id;
    }, entityManager);
  }

  /**
   * Returns a Customer.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Customer or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Customer | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(
      CustomerEntity,
      { id: idDto.id },
      { relations: ['address'] },
    );
  }

  /**
   * Returns a Customer or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Customer
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Customer> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Customer. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Customer.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateOverwrite<Customer, UpdateCustomerDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const { id, address, ...updates } = updateDto;
      const result = await manager.update(CustomerEntity, { id }, updates);
      if (result.raw.affectedRows === 0) {
        throw new NotFoundError(`Cannot update Customer. ID ${id} does not exist.`);
      }

      if (address) {
        const customer = await this.getOrFail({ id });
        await addressService.update(
          {
            ...address,
            id: customer.addressId,
          },
          manager,
        );
      }
    }, entityManager);
  }

  /**
   * Delete a Customer.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const customer = await this.getOrFail(idDto, manager);
      const result = await manager.delete(CustomerEntity, { id: idDto.id });
      if (result.raw.affectedRows === 0) {
        throw new NotFoundError(`Cannot delete Customer. ID ${idDto.id} does not exist.`);
      }
      await addressService.delete({ id: customer.addressId }, manager);
    }, entityManager);
  }

  /**
   * List Customers.
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns Customers
   */
  async list(listDto?: ListCustomerDto, entityManager?: EntityManager): Promise<Customer[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Customer> = {
      relations: ['address'],
    };

    if (listDto) {
      const { options, ...filters } = listDto;

      // filters
      findManyOptions.where = (qb: SelectQueryBuilder<Customer>) => {
        this.buildListWhereClause(qb, 'Customer', filters);
      };

      // pagination
      if (typeof options?.limit !== 'undefined') {
        findManyOptions.take = options?.limit;
        if (typeof options?.page !== 'undefined') {
          findManyOptions.skip = (options?.page - 1) * options?.limit;
        }
      }
    }

    return manager.find(CustomerEntity, findManyOptions);
  }
}

/**
 * Instance of CompanyService.
 */
export const customerService = new CustomerService();
