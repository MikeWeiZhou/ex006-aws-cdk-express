import { ICrudService, RequestIdDto } from '@ear/common';
import { Controller, ResponseStatusCode } from '@ear/core';
import { Customer } from './customer-entity';
import { customerService } from './customer-service';
import { CreateCustomerDto, CustomerDto, ListCustomerDto, UpdateCustomerDto } from './dtos';

/**
 * Processes incoming `Customer` requests and returns a suitable response.
 */
export class CustomerController {
  /**
   * {post} /customers Create a Customer.
   * @param requestDto contains data to create resource
   * @returns Customer
   */
  @Controller.process({
    requestDto: CreateCustomerDto,
    responseDto: CustomerDto,
    responseStatusCode: ResponseStatusCode.CREATED,
  })
  async create(requestDto: CreateCustomerDto): Promise<Customer> {
    return ICrudService.transaction(async (manager) => {
      const id = await customerService.create(requestDto, manager);
      return customerService.getOrFail({ id }, manager);
    });
  }

  /**
   * {get} /customers/:id Returns a Customer.
   * @param requestDto contains resource ID
   * @param req Express Request
   * @param res Express Response
   * @returns Customer
   */
  @Controller.process({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: CustomerDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async get(requestDto: RequestIdDto): Promise<CustomerDto> {
    return customerService.getOrFail(requestDto);
  }

  /**
   * {patch} /customers/:id Update a Customer.
   * @param requestDto contains data to update resource
   * @returns updated Customer
   */
  @Controller.process({
    mergeParams: ['id'],
    requestDto: UpdateCustomerDto,
    responseDto: CustomerDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async update(requestDto: UpdateCustomerDto): Promise<CustomerDto> {
    return ICrudService.transaction(async (manager) => {
      await customerService.update(requestDto, manager);
      return customerService.getOrFail(requestDto, manager);
    });
  }

  /**
   * {delete} /companies/:id Delete a Customer.
   * @param requestDto contains resource ID
   */
  @Controller.process({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseStatusCode: ResponseStatusCode.NO_CONTENT,
  })
  async delete(requestDto: RequestIdDto): Promise<void> {
    await customerService.delete(requestDto);
  }

  /**
   * {get} /customers List Customers.
   * @param requestDto contains filters and list options
   * @returns Customers
   */
  @Controller.process({
    requestDto: ListCustomerDto,
    responseDto: CustomerDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async list(requestDto: ListCustomerDto): Promise<CustomerDto[]> {
    return customerService.list(requestDto);
  }
}

/**
 * Instance of CustomerController.
 */
export const customerController = new CustomerController();
