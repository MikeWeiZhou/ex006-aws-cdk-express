import { EntityManager, FindManyOptions, getManager } from 'typeorm';
import { IdDto } from '../../common/dtos';
import { ICrudService } from '../../common/services';
import { NotFoundError } from '../../core/errors';
import { Address } from './address.model';
import { AddressUpdateDto } from './dtos';
import { AddressCreateDto } from './dtos/address.create.dto';
import { AddressListDto } from './dtos/address.list.dto';

/**
 * Service to make changes to Address resources.
 */
export class AddressService extends ICrudService<Address> {
  /**
   * Constructor.
   */
  constructor() {
    super('add_');
  }

  /**
   * Create an Address.
   * @param createDto contains company info
   * @param [entityManager] used for transactions
   * @returns resource id
   */
  async create(createDto: AddressCreateDto, entityManager?: EntityManager): Promise<string> {
    const manager = entityManager ?? getManager();
    const result = await manager.insert(Address, {
      id: await this.generateId(),
      ...createDto,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns an Address.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
   * @returns Company or undefined if not found
   */
  async get(idDto: IdDto, entityManager?: EntityManager): Promise<Address | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(Address, { id: idDto.id });
  }

  /**
   * Returns a Company or throw an error if not found.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   * @returns Company
   */
  async getOrFail(idDto: IdDto, entityManager?: EntityManager): Promise<Address> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Address. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update an Address.
   * @param updateDto DTO containing fields needing update
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   */
  async update(updateDto: AddressUpdateDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const { id, ...updates } = updateDto;
    const result = await manager.update(Address, { id }, updates);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot update Address. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete an Address.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const result = await manager.delete(Address, { id: idDto.id });
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot delete Address. ID ${idDto.id} does not exist.`);
    }
  }

  /**
   * List all addresses.
   * @param [listDto] contains filters and list options
   * @param [entityManager] used for transactions
   * @returns list of addresses
   */
  async list(listDto?: AddressListDto, entityManager?: EntityManager): Promise<Address[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Address> = {};

    if (listDto) {
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
    }

    return manager.find(Address, findManyOptions);
  }
}

/**
 * Instance of AddressService.
 */
export const addressService = new AddressService();
