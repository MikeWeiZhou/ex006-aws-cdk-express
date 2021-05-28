import { ICrudService, RequestIdDto } from '@ear/common';
import { Controller, ResponseStatusCode } from '@ear/core';
import { CreateSaleDto, ListSaleDto, SaleDto, UpdateSaleDto } from './dtos';
import { Sale } from './sale-entity';
import { saleService } from './sale-service';

/**
 * Processes incoming `Sale` requests and returns a suitable response.
 */
export class SaleController {
  /**
   * {post} /sales Create a Sale.
   * @param requestDto contains fields to insert to database
   * @param req Express Request
   * @param res Express Response
   * @returns Sale
   */
  @Controller.decorate({
    requestDto: CreateSaleDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.CREATED,
  })
  async create(requestDto: CreateSaleDto): Promise<Sale> {
    return ICrudService.transaction(async (manager) => {
      const id = await saleService.create(requestDto, manager);
      return saleService.getOrFail({ id }, manager);
    });
  }

  /**
   * {get} /sales/:id Request Sale info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Sale
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async get(requestDto: RequestIdDto): Promise<Sale> {
    return saleService.getOrFail(requestDto);
  }

  /**
   * {post} /sales/:id Update a Sale.
   * @param requestDto contains fields needing update
   * @param req Express Request
   * @param res Express Response
   * @returns updated Sale
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: UpdateSaleDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async update(requestDto: UpdateSaleDto): Promise<Sale> {
    return ICrudService.transaction(async (manager) => {
      await saleService.update(requestDto, manager);
      return saleService.getOrFail({ id: requestDto.id }, manager);
    });
  }

  /**
   * {post} /sales/:id/cancel Cancel a Sale.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Sale
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async cancel(requestDto: RequestIdDto): Promise<Sale> {
    return ICrudService.transaction(async (manager) => {
      await saleService.cancel(requestDto, manager);
      return saleService.getOrFail({ id: requestDto.id }, manager);
    });
  }

  /**
   * {post} /sales/:id/pay Pay for a Sale.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Sale
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async pay(requestDto: RequestIdDto): Promise<Sale> {
    return ICrudService.transaction(async (manager) => {
      await saleService.pay(requestDto, manager);
      return saleService.getOrFail({ id: requestDto.id }, manager);
    });
  }

  /**
   * {post} /sales/:id/refund Refund a Sale.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Sale
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async refund(requestDto: RequestIdDto): Promise<Sale> {
    return ICrudService.transaction(async (manager) => {
      await saleService.refund(requestDto, manager);
      return saleService.getOrFail({ id: requestDto.id }, manager);
    });
  }

  /**
   * {delete} /sales/:id Delete Sale info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseStatusCode: ResponseStatusCode.NO_CONTENT,
  })
  async delete(requestDto: RequestIdDto): Promise<void> {
    await saleService.delete(requestDto);
  }

  /**
   * {get} /sales Request list of sales.
   * @param requestDto contains filters and list options
   * @param req Express Request
   * @param res Express Response
   * @returns sales
   */
  @Controller.decorate({
    requestDto: ListSaleDto,
    responseDto: SaleDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async list(requestDto: ListSaleDto): Promise<Sale[]> {
    return saleService.list(requestDto);
  }
}

/**
 * Instance of SaleController.
 */
export const saleController = new SaleController();
