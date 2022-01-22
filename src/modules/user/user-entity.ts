import { BaseEntityColumns, IBaseEntity } from '@ear/common';
import { EntitySchema } from 'typeorm';

/**
 * User entity model.
 */
export interface User extends IBaseEntity {
  /**
   * Login email for user.
   */
  email: string;

  /**
   * Login password for user, salted and hashed with meta data.
   */
  passwordHash: string;

  /**
   * Random string of characters prepended to password before hashing.
   */
  salt: string;
}

/**
 * User entity constraints.
 */
export const UserEntityConstraints = {
  /**
   * Maximum string length for email address.
   */
  EMAIL_MAX_LENGTH: 100,

  /**
   * Minimum string length for password, before salting and hashing.
   */
  PASSWORD_MIN_LENGTH: 8,

  /**
   * Maximum string length for password, before salting and hashing.
   */
  PASSWORD_MAX_LENGTH: 20,

  /**
   * String length for hashed password (does not include hash meta data).
   */
  PASSWORD_HASH_LENGTH: 128,

  /**
   * Maximum string length for the password column, includes password hash and hash meta data.
   */
  PASSWORD_COLUMN_MAX_LENGTH: 255,

  /**
   * Length of salt; random string of characters prepended to password before hashing.
   */
  SALT_LENGTH: 15,
};

/**
 * User entity schema.
 */
export const UserEntity = new EntitySchema<User>({
  name: 'User',
  columns: {
    ...BaseEntityColumns,
    email: {
      type: 'varchar',
      length: UserEntityConstraints.EMAIL_MAX_LENGTH,
    },
    passwordHash: {
      type: 'varchar',
      length: UserEntityConstraints.PASSWORD_COLUMN_MAX_LENGTH,
    },
    salt: {
      type: 'char',
      length: UserEntityConstraints.SALT_LENGTH,
    },
  },
  indices: [
    {
      name: 'idx_user_unique_email',
      unique: true,
      columns: ['email'],
    },
  ],
});
