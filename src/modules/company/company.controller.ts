import { IdDto } from '../../common/dtos';
import { controllerDecorator } from '../../core/controller-decorator';
import { dtoUtility } from '../../utilities';
import { companyService } from './company.service';
import {
  CompanyCreateDto,
  CompanyListDto,
  CompanyModelDto,
  CompanyUpdateDto,
} from './dtos';

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
  @controllerDecorator.Create({
    requestDto: CompanyCreateDto,
  })
  async create(companyCreateDto: CompanyCreateDto): Promise<CompanyModelDto> {
    const company = await companyService.create(companyCreateDto);
    return dtoUtility.sanitizeToDto(CompanyModelDto, company);
  }

  /**
   * {get} /companies/:id Request Company info.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   * @returns Company
   */
  @controllerDecorator.Get({
    params: ['id'],
    requestDto: IdDto,
  })
  async get(idDto: IdDto): Promise<CompanyModelDto> {
    const company = await companyService.getOrFail(idDto);
    return dtoUtility.sanitizeToDto(CompanyModelDto, company);
  }

  /**
   * {patch} /companies/:id Update Company info.
   * @param companyUpdateDto DTO used to update Company
   * @param req Express Request
   * @param res Express Response
   * @returns updated Company
   */
  @controllerDecorator.Update({
    params: ['id'],
    requestDto: CompanyUpdateDto,
  })
  async update(companyUpdateDto: CompanyUpdateDto): Promise<CompanyModelDto> {
    await companyService.update(companyUpdateDto);
    const company = await companyService.getOrFail(companyUpdateDto);
    return dtoUtility.sanitizeToDto(CompanyModelDto, company);
  }

  /**
   * {delete} /companies/:id Delete Company info.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   */
  @controllerDecorator.Delete({
    params: ['id'],
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
  @controllerDecorator.List({
    requestDto: CompanyListDto,
  })
  async list(companyListDto: CompanyListDto): Promise<CompanyModelDto[]> {
    const companies = await companyService.list(companyListDto);
    return dtoUtility.sanitizeToDto(CompanyModelDto, companies);
  }
}

/**
 * Instance of CompanyController.
 */
export const companyController = new CompanyController();
