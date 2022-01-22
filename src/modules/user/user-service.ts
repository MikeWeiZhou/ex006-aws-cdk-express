import { ICrudService, RequestIdDto, ServiceUpdateType } from '@ear/common';
import { NotFoundError } from '@ear/core';
import argon2 from 'argon2';
import { nanoid } from 'nanoid/async';
import { EntityManager, getManager } from 'typeorm';
import { NestedCreateUserDto, NestedUpdateUserDto } from './dtos';
import { User, UserEntity, UserEntityConstraints } from './user-entity';

/**
 * Retrieves and modifies Users.
 */
export class UserService extends ICrudService<User> {
  /**
   * Constructor.
   */
  constructor() {
    super('usr_');
  }

  /**
   * Create a User.
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: NestedCreateUserDto, entityManager?: EntityManager): Promise<string> {
    const manager = entityManager ?? getManager();
    const { email, password } = createDto;
    const salt = await nanoid(UserEntityConstraints.SALT_LENGTH);
    const passwordHash = await argon2.hash(password, {
      hashLength: UserEntityConstraints.PASSWORD_HASH_LENGTH,
      salt: Buffer.from(salt, 'utf-8'),
      saltLength: UserEntityConstraints.SALT_LENGTH,
    });
    const result = await manager.insert(UserEntity, {
      id: await this.generateId(),
      email,
      passwordHash,
      salt,
    });
    return result.identifiers[0].id;
  }

  /**
   * Returns a User.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns User or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<User | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(UserEntity, idDto.id);
  }

  /**
   * Returns a User or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns User
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<User> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve User. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a User.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateType<User, NestedUpdateUserDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = entityManager ?? getManager();
    const { id, ...updates } = updateDto;
    const result = await manager.update(UserEntity, id, updates);
    if (result.raw.affectedRows !== 1) {
      throw new NotFoundError(`Cannot update User. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete a User.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ?? getManager();
    const result = await manager.delete(UserEntity, idDto.id);
    if (result.raw.affectedRows !== 1) {
      throw new NotFoundError(`Cannot delete User. ID ${idDto.id} does not exist.`);
    }
  }
}

/**
 * Instance of UserService.
 */
export const userService = new UserService();
