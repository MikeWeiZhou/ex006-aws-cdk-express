import { ICrudService, RequestIdDto } from '@ear/common';
import { Controller, ResponseStatusCode } from '@ear/core';
import { CreateProductDto, ListProductDto, ProductDto, UpdateProductDto } from './dtos';
import { productService } from './product-service';

/**
 * Processes incoming `Product` requests and returns a suitable response.
 */
export class ProductController {
  /**
   * {post} /products Create a Product.
   * @param requestDto contains data to create resource
   * @returns Product
   */
  @Controller.decorate({
    requestDto: CreateProductDto,
    responseDto: ProductDto,
    responseStatusCode: ResponseStatusCode.CREATED,
  })
  async create(requestDto: CreateProductDto): Promise<ProductDto> {
    return ICrudService.transaction(async (manager) => {
      const id = await productService.create(requestDto, manager);
      return productService.getOrFail({ id }, manager);
    });
  }

  /**
   * {get} /products/:id Returns a Product.
   * @param requestDto contains resource ID
   * @returns Product
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: ProductDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async get(requestDto: RequestIdDto): Promise<ProductDto> {
    return productService.getOrFail(requestDto);
  }

  /**
   * {patch} /product/:id Update a Product.
   * @param requestDto contains data to update resource
   * @returns updated Product
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: UpdateProductDto,
    responseDto: ProductDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async update(requestDto: UpdateProductDto): Promise<ProductDto> {
    return ICrudService.transaction(async (manager) => {
      await productService.update(requestDto, manager);
      return productService.getOrFail(requestDto, manager);
    });
  }

  /**
   * {delete} /products/:id Delete a Product.
   * @param requestDto contains resource ID
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseStatusCode: ResponseStatusCode.NO_CONTENT,
  })
  async delete(requestDto: RequestIdDto): Promise<void> {
    await productService.delete(requestDto);
  }

  /**
   * {get} /products List Products.
   * @param listDto contains filters and list options
   * @returns Products
   */
  @Controller.decorate({
    requestDto: ListProductDto,
    responseDto: ProductDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async list(requestDto: ListProductDto): Promise<ProductDto[]> {
    return productService.list(requestDto);
  }
}

/**
 * Instance of ProductController.
 */
export const productController = new ProductController();
