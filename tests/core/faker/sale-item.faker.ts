import { PartialExcept } from '@ear/common';
import { ProductDto, productService } from '@ear/modules/product';
import { NestedCreateSaleItemDto, NestedSaleItemDto } from '@ear/modules/sale-item';
import faker from 'faker';
import { IFaker } from './i.faker';
import { product } from './product.faker';

export class SaleItemFaker extends IFaker<NestedCreateSaleItemDto, any> {
  /**
   * Constructor.
   */
  constructor() {
    super('NOT_IMPLEMENTED');
  }

  /**
   * Returns DTO used for creating a SaleItem.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<NestedCreateSaleItemDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<NestedCreateSaleItemDto> {
    let createdProduct: PartialExcept<ProductDto, 'id'>;
    if (dto?.productId) {
      createdProduct = { id: dto?.productId };
    } else {
      createdProduct = (noDatabaseWrites)
        ? { id: await productService.generateId() }
        : await product.create();
    }

    const quantity = dto?.quantity ?? faker.datatype.number({ min: 1, max: 4 });
    const pricePerUnit = dto?.pricePerUnit
      ?? createdProduct.price
      ?? faker.datatype.number({ min: 1, max: 99999 });
    const total = dto?.total ?? quantity * pricePerUnit;
    return {
      productId: createdProduct.id,
      quantity,
      pricePerUnit,
      total,
    };
  }

  /**
   * Not implemented.
   */
  async create(): Promise<NestedSaleItemDto> {
    throw new Error('NOT IMPLEMENTED');
  }
}

export const saleItem = new SaleItemFaker();
