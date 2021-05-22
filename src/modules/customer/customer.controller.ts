import { IdDto } from '@ear/common/dtos';
import { Controller } from '@ear/core';
import { customerService } from './customer.service';
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
  @Controller.Create({
    requestDto: CustomerCreateDto,
    responseDto: CustomerModelDto,
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
  @Controller.Get({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseDto: CustomerModelDto,
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
  @Controller.Update({
    mergeParams: ['id'],
    requestDto: CustomerUpdateDto,
    responseDto: CustomerModelDto,
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
  @Controller.Delete({
    mergeParams: ['id'],
    requestDto: IdDto,
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
  @Controller.List({
    requestDto: CustomerListDto,
    responseDto: CustomerModelDto,
  })
  async list(requestDto: CustomerListDto): Promise<CustomerModelDto[]> {
    return customerService.list(requestDto);
  }
}

/**
 * Instance of CustomerController.
 */
export const customerController = new CustomerController();
