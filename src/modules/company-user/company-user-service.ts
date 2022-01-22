import { ICrudService, RequestIdDto, ServiceUpdateType } from '@ear/common';
import { InternalError, NotFoundError } from '@ear/core';
import { EntityManager, getManager } from 'typeorm';
import { userService } from '../user';
import { CompanyUser, CompanyUserEntity } from './company-user-entity';
import { CreateCompanyUserDto, UpdateCompanyUserDto } from './dtos';

/**
 * Retrieves and modifies CompanyUsers.
 */
export class CompanyUserService extends ICrudService<CompanyUser> {
  /**
   * Constructor.
   */
  constructor() {
    super('cou_');
  }

  /**
   * Create a CompanyUser.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: CreateCompanyUserDto, entityManager?: EntityManager): Promise<string> {
    return ICrudService.transaction(async (manager) => {
      const { companyId, user } = createDto;
      const userId = await userService.create(user, manager);
      const result = await manager.insert(CompanyUserEntity, {
        id: await this.generateId(),
        companyId,
        userId,
      });
      return result.identifiers[0].id;
    }, entityManager);
  }

  /**
   * Returns a CompanyUser.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns CompanyUser or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<CompanyUser | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(
      CompanyUserEntity,
      idDto.id,
      { relations: ['user'] },
    );
  }

  /**
   * Returns a CompanyUser or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns CompanyUser
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<CompanyUser> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve CompanyUser. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a CompanyUser.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateType<CompanyUser, UpdateCompanyUserDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    throw new InternalError('Company User update not implemented.');
    // const manager = entityManager ?? getManager();
    // const { id, ...updates } = updateDto;
    // const result = await manager.update(UserEntity, id, updates);
    // if (result.raw.affectedRows !== 1) {
    //   throw new NotFoundError(`Cannot update User. ID ${id} does not exist.`);
    // }
  }

  /**
   * Delete a CompanyUser.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const companyUser = await this.getOrFail(idDto, manager);
      const result = await manager.delete(CompanyUserEntity, idDto.id);
      if (result.raw.affectedRows !== 1) {
        throw new NotFoundError(`Cannot delete CompanyUser. ID ${idDto.id} does not exist.`);
      }
      await userService.delete({ id: companyUser.userId }, manager);
    }, entityManager);
  }
}

/**
 * Instance of CompanyUserService.
 */
export const companyUserService = new CompanyUserService();
