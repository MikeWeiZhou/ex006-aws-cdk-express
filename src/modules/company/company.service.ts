import { getRepository } from 'typeorm';
import { CrudService, CrudServiceFindProps } from '../../common/crud.service';
import { Company } from './company.model';
import { CompanyCreateDto } from './dtos/company.create.dto';

/**
 * Service to make changes to Company resources.
 */
export class CompanyService implements CrudService<Company> {
  /**
   * Create a Company.
   * @param companyCreateDto
   * @returns newly created Company
   */
  async create(companyCreateDto: CompanyCreateDto): Promise<Company> {
    const companyRepository = getRepository(Company);
    const company = companyRepository.create(companyCreateDto);
    return companyRepository.save(company);
  }

  /**
   * Find a Company.
   * @param id UUID of Company
   * @returns Company
   */
  async findOne(id: string): Promise<Company | undefined> {
    return getRepository(Company).findOne(id);
  }

  /**
   * Update a Company.
   * @param id UUID of Company
   * @param company contains desired changes of Company
   */
  async update(id: string, company: Company): Promise<void> {
    await getRepository(Company).update(id, company);
  }

  /**
   * Delete a Company.
   * @param id UUID of Company to be deleted
   */
  async delete(id: string): Promise<void> {
    await getRepository(Company).delete(id);
  }

  /**
   * Find many Companies.
   * @param props properties for a find operation
   * @returns list of Companies
   */
  async find(props: CrudServiceFindProps): Promise<Company[]> {
    return getRepository(Company).find();
  }
}

export default new CompanyService();
