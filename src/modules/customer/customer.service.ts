import { IdDto } from '@ear/common/dtos';
import { ICrudService } from '@ear/common/services';
import { NotFoundError } from '@ear/core/errors';
import { addressService } from '@ear/modules/address';
import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { Customer } from './customer.model';
import { CustomerCreateDto, CustomerListDto, CustomerUpdateDto } from './dtos';

/**
 * Service to make changes to Customer resources.
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
   * @param createDto contains fields to insert to database
   * @param entityManager used for transactions
   * @returns resource id
   */
  async create(createDto: CustomerCreateDto, entityManager?: EntityManager): Promise<string> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const { address, ...customerInfo } = createDto;
      const addressId = await addressService.create(address, manager);
      const result = await manager.insert(Customer, {
        id: await this.generateId(),
        addressId,
        ...customerInfo,
      });
      return result.identifiers[0].id;
    });
  }

  /**
   * Returns a Customer.
   * @param idDto contains resource id
   * @param entityManager used for transactions
   * @returns Customer or undefined if not found
   */
  async get(idDto: IdDto, entityManager?: EntityManager): Promise<Customer | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(
      Customer,
      { id: idDto.id },
      { relations: ['address'] },
    );
  }

  /**
   * Returns a Customer or throw an error if not found.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @throws {NotFoundError}
   * @returns Customer
   */
  async getOrFail(idDto: IdDto, entityManager?: EntityManager): Promise<Customer> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Customer. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Customer.
   * @param updateDto contains fields needing update
   * @param entityManager used for transactions
   * @throws {NotFoundError}
   */
  async update(updateDto: CustomerUpdateDto, entityManager?: EntityManager): Promise<void> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const { id, address, ...updates } = updateDto;
      const result = await manager.update(Customer, { id }, updates);
      if (result.raw.affectedRows === 0) {
        throw new NotFoundError(`Cannot update Customer. ID ${id} does not exist.`);
      }
      // update address fields
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
    });
  }

  /**
   * Delete a Customer.
   * @param idDto contains resource id
   * @param entityManager used for transactions
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto, entityManager?: EntityManager): Promise<void> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const customer = await this.getOrFail(idDto, manager);
      const result = await manager.delete(Customer, { id: idDto.id });
      if (result.raw.affectedRows === 0) {
        throw new NotFoundError(`Cannot delete Customer. ID ${idDto.id} does not exist.`);
      }
      await addressService.delete({ id: customer.addressId }, manager);
    });
  }

  /**
   * List all customers.
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns list of customers
   */
  async list(listDto?: CustomerListDto, entityManager?: EntityManager): Promise<Customer[]> {
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

    return manager.find(Customer, findManyOptions);
  }
}

/**
 * Instance of CompanyService.
 */
export const customerService = new CustomerService();
