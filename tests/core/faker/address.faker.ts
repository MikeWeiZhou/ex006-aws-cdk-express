import { NestedAddressDto, NestedCreateAddressDto } from '@ear/modules/address';
import faker from 'faker';
import { IFaker } from './i.faker';

export class AddressFaker extends IFaker<NestedCreateAddressDto, any> {
  /**
   * Constructor.
   */
  constructor() {
    super('NOT_IMPLEMENTED');
  }

  /**
   * Returns generated data to create an Address.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<NestedCreateAddressDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<NestedCreateAddressDto> {
    const line1 = dto?.line1 ?? `${faker.address.streetAddress()}`;
    const postcode = dto?.postcode ?? `${faker.address.zipCode()}`;
    const city = dto?.city ?? `${faker.address.cityName()}`;
    const province = dto?.province ?? `${faker.address.state()}`;
    const country = dto?.country ?? `${faker.address.country()}`;
    return {
      line1,
      postcode,
      city,
      province,
      country,
    };
  }

  /**
   * Not implemented.
   */
  async create(): Promise<NestedAddressDto> {
    throw new Error('NOT IMPLEMENTED');
  }
}

export const address = new AddressFaker();
