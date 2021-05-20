import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { IdDto } from '../../common/dtos';
import { ICrudService } from '../../common/services';
import { NotFoundError } from '../../core/errors';
import { addressService } from '../address/address.service';
import { Company } from './company.model';
import { CompanyCreateDto, CompanyListDto, CompanyUpdateDto } from './dtos';

/**
 * Service to make changes to Company resources.
 */
export class CompanyService extends ICrudService<Company> {
  /**
   * Constructor.
   */
  constructor() {
    super('com_');
  }

  /**
   * Create a Company.
   * @param createDto contains fields to insert to database
   * @param [entityManager] used for transactions
   * @returns resource id
   */
  async create(createDto: CompanyCreateDto, entityManager?: EntityManager): Promise<string> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const { address, ...companyInfo } = createDto;
      const addressId = await addressService.create(address, manager);
      const result = await manager.insert(Company, {
        id: await this.generateId(),
        addressId,
        ...companyInfo,
      });
      return result.identifiers[0].id;
    });
  }

  /**
   * Returns a Company.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
   * @returns Company or undefined if not found
   */
  async get(idDto: IdDto, entityManager?: EntityManager): Promise<Company | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(
      Company,
      { id: idDto.id },
      { relations: ['address'] },
    );
  }

  /**
   * Returns a Company or throw an error if not found.
   * @param idDto contains resource ID
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   * @returns Company
   */
  async getOrFail(idDto: IdDto, entityManager?: EntityManager): Promise<Company> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Company. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Company.
   * @param updateDto contains fields needing update
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   */
  async update(updateDto: CompanyUpdateDto, entityManager?: EntityManager): Promise<void> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const { id, address, ...updates } = updateDto;
      const result = await manager.update(Company, { id }, updates);
      if (result.affected === 0) {
        throw new NotFoundError(`Cannot update Company. ID ${id} does not exist.`);
      }
      if (address) {
        await addressService.update(address, manager);
      }
    });
  }

  /**
   * Delete a Company.
   * @param idDto contains resource id
   * @param [entityManager] used for transactions
   * @throws {NotFoundError}
   */
  async delete(idDto: IdDto, entityManager?: EntityManager): Promise<void> {
    return getManager().transaction(async (localEntityManager) => {
      const manager = entityManager ?? localEntityManager;
      const customer = await this.getOrFail(idDto, manager);
      const result = await manager.delete(Company, { id: idDto.id });
      if (result.affected === 0) {
        throw new NotFoundError(`Cannot delete Company. ID ${idDto.id} does not exist.`);
      }
      await addressService.delete({ id: customer.addressId }, manager);
    });
  }

  /**
   * List all companies.
   * @param [listDto] contains filters and list options
   * @param [entityManager] used for transactions
   * @returns list of companies
   */
  async list(
    listDto?: CompanyListDto,
    entityManager?: EntityManager,
  ): Promise<Company[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Company> = {
      relations: ['address'],
    };

    if (listDto) {
      const { options, address, ...filters } = listDto;

      // filters, required work-around for nested filtering of address
      // https://github.com/typeorm/typeorm/issues/2707
      findManyOptions.where = (qb: SelectQueryBuilder<Company>) => {
        Object.entries(filters).forEach(([key, value]) => {
          qb.where(`Company.${key} = :${key}`, { [key]: [value] });
        });
        if (address) {
          Object.entries(address).forEach(([key, value]) => {
            qb.where(`Company__address.${key} = :${key}`, { [key]: [value] });
          });
        }
      };

      // pagination
      if (typeof options?.limit !== 'undefined') {
        findManyOptions.take = options?.limit;
        if (typeof options?.page !== 'undefined') {
          findManyOptions.skip = (options?.page - 1) * options?.limit;
        }
      }
    }

    return manager.find(Company, findManyOptions);
  }
}

/**
 * Instance of CompanyService.
 */
export const companyService = new CompanyService();
