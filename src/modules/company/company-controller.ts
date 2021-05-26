import { ICrudService, RequestIdDto } from '@ear/common';
import { Controller, ResponseStatusCode } from '@ear/core';
import { Company } from './company-entity';
import { companyService } from './company-service';
import { CompanyDto, CreateCompanyDto, ListCompanyDto, UpdateCompanyDto } from './dtos';

/**
 * Processes incoming `Company` requests and returns a suitable response.
 */
export class CompanyController {
  /**
   * {post} /companies Create a Company.
   * @param requestDto contains data to create resource
   * @returns Company
   */
  @Controller.decorate({
    requestDto: CreateCompanyDto,
    responseDto: CompanyDto,
    responseStatusCode: ResponseStatusCode.CREATED,
  })
  async create(requestDto: CreateCompanyDto): Promise<Company> {
    return ICrudService.transaction(async (manager) => {
      const id = await companyService.create(requestDto, manager);
      return companyService.getOrFail({ id }, manager);
    });
  }

  /**
   * {get} /companies/:id Returns a Company.
   * @param requestDto contains resource ID
   * @returns Company
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: CompanyDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async get(requestDto: RequestIdDto): Promise<Company> {
    return companyService.getOrFail(requestDto);
  }

  /**
   * {patch} /companies/:id Update a Company.
   * @param requestDto contains data to update resource
   * @returns updated Company
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: UpdateCompanyDto,
    responseDto: CompanyDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async update(requestDto: UpdateCompanyDto): Promise<Company> {
    return ICrudService.transaction(async (manager) => {
      await companyService.update(requestDto, manager);
      return companyService.getOrFail(requestDto, manager);
    });
  }

  /**
   * {delete} /companies/:id Delete a Company.
   * @param requestDto contains resource id
   */
  @Controller.decorate({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseStatusCode: ResponseStatusCode.NO_CONTENT,
  })
  async delete(requestDto: RequestIdDto): Promise<void> {
    await companyService.delete(requestDto);
  }

  /**
   * {get} /companies List Companies.
   * @param requestDto contains filters and list options
   * @returns Companies
   */
  @Controller.decorate({
    requestDto: ListCompanyDto,
    responseDto: CompanyDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async list(requestDto: ListCompanyDto): Promise<Company[]> {
    return companyService.list(requestDto);
  }
}

/**
 * Instance of CompanyController.
 */
export const companyController = new CompanyController();
