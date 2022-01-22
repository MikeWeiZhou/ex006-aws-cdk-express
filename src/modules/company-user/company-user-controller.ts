import { ICrudService, RequestIdDto } from '@ear/common';
import { Controller, InternalError, ResponseStatusCode } from '@ear/core';
import { CompanyUser } from './company-user-entity';
import { companyUserService } from './company-user-service';
import { CompanyUserDto, CreateCompanyUserDto, UpdateCompanyUserDto } from './dtos';

/**
 * Processes incoming `CompanyUser` requests and returns a suitable response.
 */
export class CompanyUserController {
  /**
   * {post} /company-users Create a CompanyUser.
   * @param requestDto contains data to create resource
   * @returns CompanyUser
   */
  @Controller.process({
    requestDto: CreateCompanyUserDto,
    responseDto: CompanyUserDto,
    responseStatusCode: ResponseStatusCode.CREATED,
  })
  async create(requestDto: CreateCompanyUserDto): Promise<CompanyUser> {
    return ICrudService.transaction(async (manager) => {
      const id = await companyUserService.create(requestDto, manager);
      return companyUserService.getOrFail({ id }, manager);
    });
  }

  /**
   * {get} /company-users/:id Returns a CompanyUser.
   * @param requestDto contains resource ID
   * @returns CompanyUser
   */
  @Controller.process({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseDto: CompanyUserDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async get(requestDto: RequestIdDto): Promise<CompanyUser> {
    return companyUserService.getOrFail(requestDto);
  }

  /**
   * {patch} /company-users/:id Update a CompanyUser.
   * @param requestDto contains data to update resource
   * @returns updated CompanyUser
   */
  @Controller.process({
    mergeParams: ['id'],
    requestDto: UpdateCompanyUserDto,
    responseDto: CompanyUserDto,
    responseStatusCode: ResponseStatusCode.OK,
  })
  async update(requestDto: UpdateCompanyUserDto): Promise<CompanyUser> {
    throw new InternalError('Company User update not implemeneted.');
    // return ICrudService.transaction(async (manager) => {
    //   await companyService.update(requestDto, manager);
    //   return companyService.getOrFail(requestDto, manager);
    // });
  }

  /**
   * {delete} /company-users/:id Delete a CompanyUser.
   * @param requestDto contains resource id
   */
  @Controller.process({
    mergeParams: ['id'],
    requestDto: RequestIdDto,
    responseStatusCode: ResponseStatusCode.NO_CONTENT,
  })
  async delete(requestDto: RequestIdDto): Promise<void> {
    await companyUserService.delete(requestDto);
  }

  // /**
  //  * {get} /company-users List Companies.
  //  * @param requestDto contains filters and list options
  //  * @returns Companies
  //  */
  // @Controller.process({
  //   requestDto: ListCompanyDto,
  //   responseDto: CompanyDto,
  //   responseStatusCode: ResponseStatusCode.OK,
  // })
  // async list(requestDto: ListCompanyDto): Promise<Company[]> {
  //   return companyService.list(requestDto);
  // }
}

/**
 * Instance of CompanyUserController.
 */
export const companyUserController = new CompanyUserController();
