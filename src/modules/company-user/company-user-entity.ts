import { BaseEntityColumns, BaseEntityConstraints, IBaseEntity } from '@ear/common';
import { EntitySchema } from 'typeorm';
import { Company } from '../company/company-entity';
import { User } from '../user/user-entity';

/**
 * CompanyUser entity model.
 */
export interface CompanyUser extends IBaseEntity {
  /**
   * Company that CompanyUser belongs to.
   */
  company: Company;

  /**
   * ID of Company that CompanyUser belongs to.
   */
  companyId: string;

  /**
   * User that CompanyUser belongs to.
   */
  user: User;

  /**
   * ID of User that CompanyUser belongs to.
   */
  userId: string;
}

/**
 * CompanyUser entity constraints.
 */
export const CompanyUserEntityConstraints = {
};

/**
 * CompanyUser entity schema.
 */
export const CompanyUserEntity = new EntitySchema<CompanyUser>({
  name: 'CompanyUser',
  columns: {
    ...BaseEntityColumns,
    companyId: {
      name: 'company_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
    userId: {
      name: 'user_id',
      type: 'char',
      length: BaseEntityConstraints.RESOURCE_ID_TOTAL_LENGTH,
    },
  },
  relations: {
    company: {
      target: 'Company',
      type: 'many-to-one',
      joinColumn: {
        name: 'company_id',
      },
    },
    user: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
  indices: [
    {
      name: 'idx_company_user_unique',
      unique: true,
      columns: ['companyId', 'userId'],
    },
  ],
});
