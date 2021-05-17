import { FindManyOptions, getRepository } from 'typeorm';
import { ICrudService } from '../../common/services/i-crud.service';
import { NotFoundError } from '../../core/errors/not-found.error';
import { Company } from './company.model';
import { CompanyCreateDto } from './dtos/company.create.dto';
import { CompanyListDto } from './dtos/company.list.dto';
import { CompanyUpdateDto } from './dtos/company.update.dto';

/**
 * Service to make changes to Company resources.
 */
export class CompanyService implements ICrudService<Company> {
  /**
   * Company repository.
   */
  get repository() {
    return getRepository(Company);
  }

  /**
   * Create a Company.
   * @param companyCreateDto
   * @returns newly created Company
   */
  async create(companyCreateDto: CompanyCreateDto): Promise<Company> {
    const company = this.repository.create(companyCreateDto);
    return this.repository.save(company);
  }

  /**
   * Returns a Company.
   * @param id UUID of Company
   * @returns Company or undefined if not found
   */
  async get(id: string): Promise<Company | undefined> {
    return this.repository.findOne(id);
  }

  /**
   * Returns a Company or throw an error if not found.
   * @param id UUID of Company
   * @returns Company
   */
  async getOrFail(id: string): Promise<Company> {
    const result = await this.get(id);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Company. ID ${id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Company.
   * @param id UUID of Company
   * @param company contains desired changes of Company
   * @throws {Error}
   */
  async update(id: string, company: CompanyUpdateDto): Promise<void> {
    const result = await this.repository.update(id, company);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot update Company. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete a Company.
   * @param id UUID of Company to be deleted
   */
  async delete(id: string): Promise<void> {
    const result = await getRepository(Company).delete(id);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot delete Company. ID ${id} does not exist.`);
    }
  }

  /**
   * List all companies.
   * @param listDto parameters and options
   * @returns list of Companies
   */
  async list(listDto: CompanyListDto): Promise<Company[]> {
    const options: FindManyOptions<Company> = {};

    // filters
    options.where = {};
    if (typeof listDto.name !== 'undefined') options.where.name = listDto.name;
    if (typeof listDto.email !== 'undefined') options.where.email = listDto.email;
    if (typeof listDto.address !== 'undefined') options.where.address = listDto.address;

    // pagination
    if (typeof listDto.options?.limit !== 'undefined') {
      options.take = listDto.options?.limit;
      if (typeof listDto.options?.page !== 'undefined') {
        options.skip = (listDto.options?.page - 1) * listDto.options?.limit;
      }
    }

    return getRepository(Company).find(options);
  }
}

export default new CompanyService();
