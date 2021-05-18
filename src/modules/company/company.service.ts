import { FindManyOptions, getRepository } from 'typeorm';
import { IdDto } from '../../common/dtos';
import { ICrudService } from '../../common/i-crud.service';
import { NotFoundError } from '../../core/errors';
import { Company, CompanySchema } from './company.model';
import { CompanyCreateDto, CompanyListDto, CompanyUpdateDto } from './dtos';

/**
 * Service to make changes to Company resources.
 */
export class CompanyService extends ICrudService<Company> {
  /**
   * Resource ID prefix. (Must be 4 characters)
   */
  private readonly idPrefix = 'com_';

  /**
   * Company repository.
   */
  get repository() {
    return getRepository(CompanySchema);
  }

  /**
   * Create a Company.
   * @param companyCreateDto
   * @returns newly created Company
   */
  async create(companyCreateDto: CompanyCreateDto): Promise<Company> {
    const company = this.repository.create({
      id: this.generateId(this.idPrefix),
      ...companyCreateDto,
    });
    return this.repository.save(company);
  }

  /**
   * Returns a Company.
   * @param idDto
   * @returns Company or undefined if not found
   */
  async get(idDto: IdDto): Promise<Company | undefined> {
    return this.repository.findOne(idDto.id);
  }

  /**
   * Returns a Company or throw an error if not found.
   * @param idDto
   * @throws {NotFoundError}
   * @returns Company
   */
  async getOrFail(idDto: IdDto): Promise<Company> {
    const result = await this.get(idDto);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Company. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Company.
   * @param companyUpdateDto DTO containing fields needing update
   * @throws {NotFoundError}
   */
  async update(companyUpdateDto: CompanyUpdateDto): Promise<void> {
    const { id, ...updates } = companyUpdateDto;
    const result = await this.repository.update(id, updates);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot update Company. ID ${id} does not exist.`);
    }
  }

  /**
   * Delete a Company.
   * @param idDto
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto): Promise<void> {
    const result = await this.repository.delete(idDto.id);
    if (result.affected === 0) {
      throw new NotFoundError(`Cannot delete Company. ID ${idDto.id} does not exist.`);
    }
  }

  /**
   * List all companies.
   * @param listDto parameters and options
   * @returns list of Companies
   */
  async list(listDto: CompanyListDto): Promise<Company[]> {
    const { options, ...filters } = listDto;
    const findManyOptions: FindManyOptions<Company> = {};

    // filters
    findManyOptions.where = {};
    if (typeof filters.name !== 'undefined') findManyOptions.where.name = filters.name;
    if (typeof filters.email !== 'undefined') findManyOptions.where.email = filters.email;
    if (typeof filters.streetAddress !== 'undefined') findManyOptions.where.streetAddress = filters.streetAddress;
    if (typeof filters.city !== 'undefined') findManyOptions.where.city = filters.city;
    if (typeof filters.state !== 'undefined') findManyOptions.where.state = filters.state;
    if (typeof filters.country !== 'undefined') findManyOptions.where.country = filters.country;

    // pagination
    if (typeof options?.limit !== 'undefined') {
      findManyOptions.take = options?.limit;
      if (typeof options?.page !== 'undefined') {
        findManyOptions.skip = (options?.page - 1) * options?.limit;
      }
    }

    return this.repository.find(findManyOptions);
  }
}

/**
 * Instance of CompanyService.
 */
export const companyService = new CompanyService();
