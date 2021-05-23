import { IdDto } from '@ear/common';
import { Controller } from '@ear/core';
import { companyService } from './company-service';
import { CompanyCreateDto, CompanyListDto, CompanyModelDto, CompanyUpdateDto } from './dtos';

/**
 * Processes incoming `Company` requests and returns a suitable response.
 */
export class CompanyController {
  /**
   * {post} /companies Create a Company.
   * @param requestDto contains fields to insert to database
   * @param req Express Request
   * @param res Express Response
   * @returns company
   */
  @Controller.Create({
    requestDto: CompanyCreateDto,
    responseDto: CompanyModelDto,
  })
  async create(requestDto: CompanyCreateDto): Promise<CompanyModelDto> {
    const id = await companyService.create(requestDto);
    return companyService.getOrFail({ id });
  }

  /**
   * {get} /companies/:id Request Company info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   * @returns Company
   */
  @Controller.Get({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseDto: CompanyModelDto,
  })
  async get(requestDto: IdDto): Promise<CompanyModelDto> {
    return companyService.getOrFail(requestDto);
  }

  /**
   * {patch} /companies/:id Update Company info.
   * @param requestDto contains fields needing update
   * @param req Express Request
   * @param res Express Response
   * @returns updated Company
   */
  @Controller.Update({
    mergeParams: ['id'],
    requestDto: CompanyUpdateDto,
    responseDto: CompanyModelDto,
  })
  async update(requestDto: CompanyUpdateDto): Promise<CompanyModelDto> {
    await companyService.update(requestDto);
    return companyService.getOrFail(requestDto);
  }

  /**
   * {delete} /companies/:id Delete Company info.
   * @param requestDto contains resource id
   * @param req Express Request
   * @param res Express Response
   */
  @Controller.Delete({
    mergeParams: ['id'],
    requestDto: IdDto,
  })
  async delete(requestDto: IdDto): Promise<void> {
    await companyService.delete(requestDto);
  }

  /**
   * {get} /companies Request list of companies.
   * @param listDto contains filters and list options
   * @param req Express Request
   * @param res Express Response
   * @returns companies
   */
  @Controller.List({
    requestDto: CompanyListDto,
    responseDto: CompanyModelDto,
  })
  async list(requestDto: CompanyListDto): Promise<CompanyModelDto[]> {
    return companyService.list(requestDto);
  }
}

/**
 * Instance of CompanyController.
 */
export const companyController = new CompanyController();
