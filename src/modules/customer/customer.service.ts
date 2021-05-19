import { FindManyOptions, getRepository } from 'typeorm';
import { IdDto } from '../../common/dtos';
import { ICrudService } from '../../common/services/i-crud.service';
import { NotFoundError } from '../../core/errors';
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
   * Company repository.
   */
  get repository() {
    return getRepository(Customer);
  }

  /**
   * Create a Customer.
   * @param customerCreateDto
   * @returns resource ID
   */
  async create(customerCreateDto: CustomerCreateDto): Promise<string> {
    const result = await this.repository.insert({
      id: this.generateId(),
      ...customerCreateDto,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns a Customer.
   * @param idDto
   * @returns Customer or undefined if not found
   */
  async get(idDto: IdDto): Promise<Customer | undefined> {
    return this.repository.findOne(idDto.id);
  }

  /**
   * Returns a Customer or throw an error if not found.
   * @param idDto
   * @throws {NotFoundError}
   * @returns Customer
   */
  async getOrFail(idDto: IdDto): Promise<Customer> {
    const result = await this.get(idDto);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Customer. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Customer.
   * @param customerUpdateDto DTO containing fields needing update
   * @throws {NotFoundError}
   */
  async update(customerUpdateDto: CustomerUpdateDto): Promise<void> {
    const { id, ...updates } = customerUpdateDto;
    const result = await this.repository.update(id, updates);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot update Customer. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete a Customer.
   * @param idDto
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto): Promise<void> {
    const result = await this.repository.delete(idDto.id);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot delete Customer. ID ${idDto.id} does not exist.`);
    }
  }

  /**
   * List all customers.
   * @param [listDto] parameters and options
   * @returns list of customers
   */
  async list(listDto?: Partial<CustomerListDto>): Promise<Customer[]> {
    if (!listDto) {
      return this.repository.find();
    }

    const findManyOptions: FindManyOptions<Customer> = {};
    const { options, ...filters } = listDto;

    // filters
    findManyOptions.where = filters;

    // pagination
    if (typeof options?.limit !== 'undefined') {
      findManyOptions.take = options?.limit;
      if (typeof options?.page !== 'undefined') {
        findManyOptions.skip = (options?.page - 1) * options?.limit;
      }
    }

    return this.repository.find(findManyOptions);
  }
}

/**
 * Instance of CompanyService.
 */
export const customerService = new CustomerService();
