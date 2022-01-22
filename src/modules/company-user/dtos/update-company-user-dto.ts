import { IDto } from '@ear/common';
import { NestedUpdateUserDto, User } from '@ear/modules/user';
import { Expose, Type } from 'class-transformer';

/**
 * Update CompanyUser request parameters sanitized and validated to spec.
 */
export class UpdateCompanyUserDto implements IDto {
  @Expose()
  @Type(() => NestedUpdateUserDto)
  readonly user!: User;
}
