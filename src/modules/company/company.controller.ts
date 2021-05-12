import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { CompanyCreateDto } from './dtos/company.create.dto';
import companyService from './company.service';

/**
 * Processes incoming `Company` requests and returns a suitable response.
 */
export class CompanyController {
  /**
   * Request for creating a company.
   */
  async create(req: Request, res: Response) {
    const company = plainToClass(CompanyCreateDto, req.body);
    res.json(await companyService.create(company));
  }

  /**
   * Request for finding a company.
   */
  async findOne(req: Request, res: Response) {
    // res.json(await companyService.getById(req.body.company_id));
    res.send('findOne');
  }

  /**
   * Request for updating a company.
   */
  async update(req: Request, res: Response) {
    // const company: CompanyUpdateDto = {
    //   company_id: req.body.company_id,
    //   name: req.body.name,
    // };
    // res.json(await companiesService.update(company));
    res.send('update');
  }

  /**
   * Request for deleting a company.
   */
  async delete(req: Request, res: Response) {
    // res.json(await companiesService.deleteById(req.body.company_id));
    res.send('delete');
  }

  /**
   * Requesting for finding many companies.
   */
  async find(req: Request, res: Response) {
    res.json(await companyService.find({}));
  }
}

export default new CompanyController();
