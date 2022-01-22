import { IDto } from '@ear/common';
import { Expose } from 'class-transformer';

/**
 * User data sanitized to spec and sent back to client as response.
 *
 * Only used for sanitization when in a nested response of another entity.
 */
export class NestedUserDto implements IDto {
  @Expose()
  readonly email!: string;
}
