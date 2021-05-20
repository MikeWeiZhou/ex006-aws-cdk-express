import { IdDto } from '../../common/dtos';
import { Controller } from '../../core/controller';
import { companyService } from './company.service';
import { CompanyCreateDto, CompanyListDto, CompanyModelDto, CompanyUpdateDto } from './dtos';

/**
 * Processes incoming `Company` requests and returns a suitable response.
 */
export class CompanyController {
  /**
   * {post} /companies Create a Company.
   * @param companyCreateDto DTO used to create a Company
   * @param req Express Request
   * @param res Express Response
   * @returns created Company
   */
  @Controller.Create({
    requestDto: CompanyCreateDto,
    responseDto: CompanyModelDto,
  })
  async create(companyCreateDto: CompanyCreateDto): Promise<CompanyModelDto> {
    const id = await companyService.create(companyCreateDto);
    return companyService.getOrFail({ id });
  }

  /**
   * {get} /companies/:id Request Company info.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   * @returns Company
   */
  @Controller.Get({
    mergeParams: ['id'],
    requestDto: IdDto,
    responseDto: CompanyModelDto,
  })
  async get(idDto: IdDto): Promise<CompanyModelDto> {
    return companyService.getOrFail(idDto);
  }

  /**
   * {patch} /companies/:id Update Company info.
   * @param companyUpdateDto DTO used to update Company
   * @param req Express Request
   * @param res Express Response
   * @returns updated Company
   */
  @Controller.Update({
    mergeParams: ['id'],
    requestDto: CompanyUpdateDto,
    responseDto: CompanyModelDto,
  })
  async update(companyUpdateDto: CompanyUpdateDto): Promise<CompanyModelDto> {
    await companyService.update(companyUpdateDto);
    return companyService.getOrFail(companyUpdateDto);
  }

  /**
   * {delete} /companies/:id Delete Company info.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   */
  @Controller.Delete({
    mergeParams: ['id'],
    requestDto: IdDto,
  })
  async delete(idDto: IdDto): Promise<void> {
    await companyService.delete(idDto);
  }

  /**
   * {get} /companies Request list of companies.
   * @param idDto DTO with list options
   * @param req Express Request
   * @param res Express Response
   * @returns companies
   */
  @Controller.List({
    requestDto: CompanyListDto,
    responseDto: CompanyModelDto,
  })
  async list(companyListDto: CompanyListDto): Promise<CompanyModelDto[]> {
    return companyService.list(companyListDto);
  }
}

/**
 * Instance of CompanyController.
 */
export const companyController = new CompanyController();
