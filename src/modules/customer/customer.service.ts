import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { IdDto } from '../../common/dtos';
import { ICrudService } from '../../common/services';
import { NotFoundError } from '../../core/errors';
import { addressService } from '../address/address.service';
import { Customer } from './customer.model';
import { CustomerCreateDto, CustomerUpdateDto } from './dtos';
import { CustomerListDto } from './dtos/customer.list.dto';

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
   * @param [entityManager] used for transactions
   * @returns resource id
   */
  async create(createDto: CustomerCreateDto, entityManager?: EntityManager): Promise<string> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const { address, ...customerInfo } = createDto;
      const addressId = await addressService.create(address, manager);
      const result = await manager.insert(Customer, {
        id: this.generateId(),
        addressId,
        ...customerInfo,
      });
      return result.identifiers[0].id;
    });
  }

  /**
   * Returns a Customer.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
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
   * @param [entityManager] used for transactions
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
   * @param updateDto DTO containing fields needing update
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   */
  async update(updateDto: CustomerUpdateDto, entityManager?: EntityManager): Promise<void> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const { id, address, ...updates } = updateDto;
      const result = await manager.update(Customer, { id }, updates);
      if (result.affected === 0) {
        throw new NotFoundError(`Cannot update Customer. ID ${id} does not exist.`);
      }
      if (address) {
        await addressService.update(address, manager);
      }
    });
  }

  /**
   * Delete a Customer.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto, entityManager?: EntityManager): Promise<void> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const customer = await this.getOrFail(idDto, manager);
      const result = await manager.delete(Customer, { id: idDto.id });
      if (result.affected === 0) {
        throw new NotFoundError(`Cannot delete Customer. ID ${idDto.id} does not exist.`);
      }
      await addressService.delete({ id: customer.addressId }, manager);
    });
  }

  /**
   * List all customers.
   * @param [listDto] contains filters and list options
   * @param [entityManager] used for transactions
   * @returns list of customers
   */
  async list(
    listDto?: CustomerListDto,
    entityManager?: EntityManager,
  ): Promise<Customer[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Customer> = {
      relations: ['address'],
    };

    if (listDto) {
      const { options, address, ...filters } = listDto;

      // filters, required work-around for nested filtering of address
      // https://github.com/typeorm/typeorm/issues/2707
      findManyOptions.where = (qb: SelectQueryBuilder<Customer>) => {
        Object.entries(filters).forEach(([key, value]) => {
          qb.where(`Customer.${key} = :${key}`, { [key]: [value] });
        });
        if (address) {
          Object.entries(address).forEach(([key, value]) => {
            qb.where(`Customer__address.${key} = :${key}`, { [key]: [value] });
          });
        }
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
