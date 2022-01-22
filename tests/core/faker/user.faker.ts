import { NestedCreateUserDto, NestedUserDto, UserEntityConstraints } from '@ear/modules/user';
import faker from 'faker';
import { IFaker } from './i.faker';

export class UserFaker extends IFaker<NestedCreateUserDto, any> {
  /**
   * Constructor.
   */
  constructor() {
    super('NOT_IMPLEMENTED');
  }

  /**
   * Returns DTO used for creating a User.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<NestedCreateUserDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<NestedCreateUserDto> {
    const email = dto?.email ?? faker.internet.email();
    const password = dto?.password
      ?? faker.internet.password(UserEntityConstraints.PASSWORD_MIN_LENGTH);
    return {
      email,
      password,
    };
  }

  /**
   * Not implemented.
   */
  async create(): Promise<NestedUserDto> {
    throw new Error('NOT IMPLEMENTED');
  }
}

export const user = new UserFaker();
