import { IdDto } from '@ear/common';
import { Controller, ResponseStatusCode } from '@ear/core';
import { customerService } from './customer-service';
import { CustomerCreateDto, CustomerListDto, CustomerModelDto, CustomerUpdateDto } from './dtos';

/**
 * Processes incoming `Customer` requests and returns a suitable response.
 */
export class CustomerController {
  /**
   * {post} /customers Create a Customer.
   * @param requestDto contains fields to insert to database
   * @param req Express Request
   * @param res Express Response
   * @returns Customer
   */
  @Controller.decorate({
    requestDto: CustomerCreateDto,
    responseDto: CustomerModelDto,
    responseStatusCode: ResponseStatusCode.CREATED,
  })
  async create(requestDto: CustomerCreateDto): Promise<CustomerModelDto> {
    const id = await customerService.create(requestDto);
    return customerService.getOrFail({ id });
  }

  /**
   * {get} /customers/:id Request Customer info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Customer
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseDto: CustomerModelDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async get(requestDto: IdDto): Promise<CustomerModelDto> {
    return customerService.getOrFail(requestDto);
  }

  /**
   * {patch} /customers/:id Update Customer info.
   * @param requestDto contains fields needing update
   * @param req Express Request
   * @param res Express Response
   * @returns updated Customer
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: CustomerUpdateDto,
    responseDto: CustomerModelDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async update(requestDto: CustomerUpdateDto): Promise<CustomerModelDto> {
    await customerService.update(requestDto);
    return customerService.getOrFail(requestDto);
  }

  /**
   * {delete} /companies/:id Delete a Customer.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseStatusCode: ResponseStatusCode.NO_CONTENT,
  })
  async delete(requestDto: IdDto): Promise<void> {
    await customerService.delete(requestDto);
  }

  /**
   * {get} /customers Request list of customers.
   * @param listDto contains filters and list options
   * @param req Express Request
   * @param res Express Response
   * @returns customers
   */
  @Controller.decorate({
    requestDto: CustomerListDto,
    responseDto: CustomerModelDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async list(requestDto: CustomerListDto): Promise<CustomerModelDto[]> {
    return customerService.list(requestDto);
  }
}

/**
 * Instance of CustomerController.
 */
export const customerController = new CustomerController();
