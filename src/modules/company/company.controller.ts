import { Request, Response } from 'express';
import companyService from './company.service';
import { Company } from './company.model';
import { CompanyCreateDto } from './dtos/company.create.dto';
import controllerDecorator from '../../core/controller-decorator';
import { IdDto } from '../../common/dtos/id.dto';
import { CompanyUpdateDto } from './dtos/company.update.dto';
import { CompanyListDto } from './dtos/company.list.dto';

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
    dto: CompanyCreateDto,
  })
  async create(companyCreateDto: CompanyCreateDto, req: Request, res: Response): Promise<Company> {
    return companyService.create(companyCreateDto);
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
    dto: IdDto,
  })
  async get(idDto: IdDto, req: Request, res: Response): Promise<Company | undefined> {
    return companyService.get(idDto.id);
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
    dto: CompanyUpdateDto,
  })
  async update(companyUpdateDto: CompanyUpdateDto, req: Request, res: Response): Promise<Company> {
    await companyService.update(companyUpdateDto.id, companyUpdateDto);
    return companyService.getOrFail(companyUpdateDto.id);
  }

  /**
   * {delete} /companies/:id Delete Company info.
   * @param idDto DTO with only ID property
   * @param req Express Request
   * @param res Express Response
   */
  @controllerDecorator.Delete({
    params: ['id'],
    dto: IdDto,
  })
  async delete(idDto: IdDto, req: Request, res: Response): Promise<void> {
    return companyService.delete(idDto.id);
  }

  /**
   * {get} /companies Request list of companies.
   * @param idDto DTO with list options
   * @param req Express Request
   * @param res Express Response
   * @returns companies
   */
  @controllerDecorator.List({
    dto: CompanyListDto,
  })
  async list(companyListDto: CompanyListDto, req: Request, res: Response): Promise<Company[]> {
    return companyService.list(companyListDto);
  }
}

export default new CompanyController();
