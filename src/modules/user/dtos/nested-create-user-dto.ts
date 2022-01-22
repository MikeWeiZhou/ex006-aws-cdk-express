import { IDto, IsMaxLength } from '@ear/common';
import { Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { UserEntityConstraints } from '../user-entity';

/**
 * Create User request parameters sanitized and validated to spec.
 *
 * Only used for sanitization and validation when in a nested create request of another entity.
 */
export class NestedCreateUserDto implements IDto {
  @Expose()
  @IsEmail()
  @IsMaxLength(UserEntityConstraints.EMAIL_MAX_LENGTH)
  readonly email!: string;

  @Expose()
  @Length(UserEntityConstraints.PASSWORD_MIN_LENGTH, UserEntityConstraints.PASSWORD_MAX_LENGTH)
  readonly password!: string;
}
