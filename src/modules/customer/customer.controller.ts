import { IdDto } from '../../common/dtos';
import { Controller } from '../../core/controller';
import { customerService } from './customer.service';
import { CustomerCreateDto, CustomerUpdateDto } from './dtos';
import { CustomerListDto } from './dtos/customer.list.dto';
import { CustomerModelDto } from './dtos/customer.model.dto';

/**
 * Processes incoming `Customer` requests and returns a suitable response.
 */
export class CustomerController {
  /**
   * {post} /customers Create a Customer.
   * @param customerCreateDto DTO used to create a Customer
   * @param req Express Request
   * @param res Express Response
   * @returns created Customer
   */
  @Controller.Create({
    requestDto: CustomerCreateDto,
    responseDto: CustomerModelDto,
  })
  async create(customerCreateDto: CustomerCreateDto): Promise<CustomerModelDto> {
    const id = await customerService.create(customerCreateDto);
    return customerService.getOrFail({ id });
  }

  /**
   * {get} /customers/:id Request Customer info.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   * @returns Customer
   */
  @Controller.Get({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseDto: CustomerModelDto,
  })
  async get(idDto: IdDto): Promise<CustomerModelDto> {
    return customerService.getOrFail(idDto);
  }

  /**
   * {patch} /customers/:id Update Customer info.
   * @param customerUpdateDto DTO used to update Customer
   * @param req Express Request
   * @param res Express Response
   * @returns updated Customer info
   */
  @Controller.Update({
    mergeParams: ['id'],
    requestDto: CustomerUpdateDto,
    responseDto: CustomerModelDto,
  })
  async update(customerUpdateDto: CustomerUpdateDto): Promise<CustomerModelDto> {
    await customerService.update(customerUpdateDto);
    return customerService.getOrFail(customerUpdateDto);
  }

  /**
   * {delete} /companies/:id Delete Customer.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   */
  @Controller.Delete({
    mergeParams: ['id'],
    requestDto: IdDto,
  })
  async delete(idDto: IdDto): Promise<void> {
    await customerService.delete(idDto);
  }

  /**
   * {get} /customers Request list of customer.
   * @param idDto DTO with list options
   * @param req Express Request
   * @param res Express Response
   * @returns customers
   */
  @Controller.List({
    requestDto: CustomerListDto,
    responseDto: CustomerModelDto,
  })
  async list(customerListDto: CustomerListDto): Promise<CustomerModelDto[]> {
    return customerService.list(customerListDto);
  }
}

/**
 * Instance of CustomerController.
 */
export const customerController = new CustomerController();
