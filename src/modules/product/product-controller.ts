import { IdDto } from '@ear/common';
import { Controller } from '@ear/core';
import { ProductCreateDto, ProductListDto, ProductModelDto, ProductUpdateDto } from './dtos';
import { productService } from './product-service';

/**
 * Processes incoming `Product` requests and returns a suitable response.
 */
export class ProductController {
  /**
   * {post} /products Create a Product.
   * @param requestDto contains fields to insert to database
   * @param req Express Request
   * @param res Express Response
   * @returns Product
   */
  @Controller.Create({
    requestDto: ProductCreateDto,
    responseDto: ProductModelDto,
  })
  async create(requestDto: ProductCreateDto): Promise<ProductModelDto> {
    const id = await productService.create(requestDto);
    return productService.getOrFail({ id });
  }

  /**
   * {get} /products/:id Request Product info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Product
   */
  @Controller.Get({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseDto: ProductModelDto,
  })
  async get(requestDto: IdDto): Promise<ProductModelDto> {
    return productService.getOrFail(requestDto);
  }

  /**
   * {patch} /product/:id Update Product info.
   * @param requestDto contains fields needing update
   * @param req Express Request
   * @param res Express Response
   * @returns updated Product
   */
  @Controller.Update({
    mergeParams: ['id'],
    requestDto: ProductUpdateDto,
    responseDto: ProductModelDto,
  })
  async update(requestDto: ProductUpdateDto): Promise<ProductModelDto> {
    await productService.update(requestDto);
    return productService.getOrFail(requestDto);
  }

  /**
   * {delete} /products/:id Delete Product info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   */
  @Controller.Delete({
    mergeParams: ['id'],
    requestDto: IdDto,
  })
  async delete(requestDto: IdDto): Promise<void> {
    await productService.delete(requestDto);
  }

  /**
   * {get} /products Request list of products.
   * @param listDto contains filters and list options
   * @param req Express Request
   * @param res Express Response
   * @returns products
   */
  @Controller.List({
    requestDto: ProductListDto,
    responseDto: ProductModelDto,
  })
  async list(requestDto: ProductListDto): Promise<ProductModelDto[]> {
    return productService.list(requestDto);
  }
}

/**
 * Instance of ProductController.
 */
export const productController = new ProductController();
