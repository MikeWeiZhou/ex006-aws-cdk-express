import { IdDto } from '../../common/dtos';
import { Controller } from '../../core/controller';
import { dtoUtility } from '../../utilities';
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
  })
  async create(customerCreateDto: CustomerCreateDto): Promise<CustomerModelDto> {
    const id = await customerService.create(customerCreateDto);
    const customer = await customerService.getOrFail({ id });
    return dtoUtility.sanitizeToDto(CustomerModelDto, customer);
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
  })
  async get(idDto: IdDto): Promise<CustomerModelDto> {
    const customer = await customerService.getOrFail(idDto);
    return dtoUtility.sanitizeToDto(CustomerModelDto, customer);
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
  })
  async update(customerUpdateDto: CustomerUpdateDto): Promise<CustomerModelDto> {
    await customerService.update(customerUpdateDto);
    const customer = await customerService.getOrFail(customerUpdateDto);
    return dtoUtility.sanitizeToDto(CustomerModelDto, customer);
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
  })
  async list(customerListDto: CustomerListDto): Promise<CustomerModelDto[]> {
    const companies = await customerService.list(customerListDto);
    return dtoUtility.sanitizeToDto(CustomerModelDto, companies);
  }
}

/**
 * Instance of CustomerController.
 */
export const customerController = new CustomerController();
