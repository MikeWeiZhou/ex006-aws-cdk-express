import { IResponseBaseDto } from '@ear/common';
import { NestedUserDto } from '@ear/modules/user';
import { Expose, Type } from 'class-transformer';

/**
 * CompanyUser data sanitized to spec and sent back to client as response.
 */
export class CompanyUserDto extends IResponseBaseDto {
  @Expose()
  readonly companyId!: string;

  @Expose()
  @Type(() => NestedUserDto)
  readonly user!: NestedUserDto;
}
