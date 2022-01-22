import { IDto } from '@ear/common';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';
import { UserEntityConstraints } from '../user-entity';

/**
 * Update User request parameters sanitized and validated to spec.
 *
 * Only used for sanitization and validation when in a nested update request of another entity.
 */
export class NestedUpdateUserDto implements IDto {
  @Expose()
  @Length(UserEntityConstraints.PASSWORD_MIN_LENGTH, UserEntityConstraints.PASSWORD_MAX_LENGTH)
  readonly password!: string;
}
