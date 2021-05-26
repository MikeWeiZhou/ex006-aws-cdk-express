import { IDto } from '@ear/common';
import { Expose } from 'class-transformer';

/**
 * Address data sanitized to spec and sent back to client as response.
 *
 * Only used for sanitization when in a nested response of another entity.
 */
export class NestedAddressDto implements IDto {
  @Expose()
  readonly line1!: string;

  @Expose()
  readonly postcode!: string;

  @Expose()
  readonly city!: string;

  @Expose()
  readonly province!: string;

  @Expose()
  readonly country!: string;
}
