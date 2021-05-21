import faker from 'faker';
import { AddressCreateDto, AddressModelDto } from '../../../src/modules/address/dtos';
import { IFaker } from './i.faker';

export class AddressFaker extends IFaker<AddressCreateDto, AddressModelDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('NOT_IMPLEMENTED');
  }

  /**
   * Returns DTO used for creating an Address.
   * @param dto uses any provided properties over generated ones
   * @returns DTO
   */
  async dto(dto?: Partial<AddressCreateDto>): Promise<AddressCreateDto> {
    const address = dto?.address ?? `${faker.address.streetAddress()} ${faker.address.streetName()}`;
    const postcode = dto?.postcode ?? `${faker.address.zipCode()}`;
    const city = dto?.city ?? `${faker.address.cityName()}`;
    const province = dto?.province ?? `${faker.address.state()}`;
    const country = dto?.country ?? `${faker.address.country()}`;
    return {
      address,
      postcode,
      city,
      province,
      country,
    };
  }

  /**
   * Not implemented.
   */
  async create(): Promise<AddressModelDto> {
    throw new Error('NOT IMPLEMENTED');
  }

  /**
   * @override
   * Not implemented.
   */
  async cleanGarbage(): Promise<void> {
    throw new Error('NOT IMPLEMENTED');
  }

  /**
   * @override
   * Not implemented.
   */
  async addToGarbageBin(): Promise<void> {
    throw new Error('NOT IMPLEMENTED');
  }
}

export const address = new AddressFaker();
