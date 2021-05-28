import { ICrudService, RequestIdDto, ServiceUpdateType } from '@ear/common';
import { NotFoundError } from '@ear/core';
import { EntityManager, getManager } from 'typeorm';
import { Address, AddressEntity } from './address-entity';
import { NestedCreateAddressDto } from './dtos/nested-create-address-dto';
import { NestedUpdateAddressDto } from './dtos/nested-update-address-dto';

/**
 * Retrieves and modifies Addresses.
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
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: NestedCreateAddressDto, entityManager?: EntityManager): Promise<string> {
    const manager = entityManager ?? getManager();
    const result = await manager.insert(AddressEntity, {
      id: await this.generateId(),
      ...createDto,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns an Address.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Company or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Address | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(AddressEntity, idDto.id);
  }

  /**
   * Returns a Company or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Company
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Address> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Address. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update an Address.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateType<Address, NestedUpdateAddressDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = entityManager ?? getManager();
    const { id, ...updates } = updateDto;
    const result = await manager.update(AddressEntity, id, updates);
    if (result.raw.affectedRows !== 1) {
      throw new NotFoundError(`Cannot update Address. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete an Address.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const result = await manager.delete(AddressEntity, idDto.id);
    if (result.raw.affectedRows !== 1) {
      throw new NotFoundError(`Cannot delete Address. ID ${idDto.id} does not exist.`);
    }
  }
}

/**
 * Instance of AddressService.
 */
export const addressService = new AddressService();
