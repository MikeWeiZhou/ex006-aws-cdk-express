import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns, IModel } from '../../common/i.model';

/**
 * Company model.
 */
export interface Company extends IModel {
  name: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
}

/**
 * Company database schema.
 */
export const CompanySchema = new EntitySchema<Company>({
  name: 'company',
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      length: 50,
    },
    email: {
      type: String,
      length: 100,
    },
    streetAddress: {
      type: String,
      length: 100,
    },
    city: {
      type: String,
      length: 100,
    },
    state: {
      type: String,
      length: 100,
    },
    country: {
      type: String,
      length: 100,
    },
  },
  indices: [
    {
      name: 'idx_company_unique_email',
      unique: true,
      columns: ['email'],
    },
  ],
});
