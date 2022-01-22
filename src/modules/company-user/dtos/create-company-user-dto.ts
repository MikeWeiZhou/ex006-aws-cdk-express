import { IDto, IsResourceId } from '@ear/common';
import { NestedCreateUserDto } from '@ear/modules/user';
import { Expose, Type } from 'class-transformer';

/**
 * Create CompanyUser request parameters sanitized and validated to spec.
 */
export class CreateCompanyUserDto implements IDto {
  @Expose()
  @IsResourceId()
  readonly companyId!: string;

  @Expose()
  @Type(() => NestedCreateUserDto)
  readonly user!: NestedCreateUserDto;
}
