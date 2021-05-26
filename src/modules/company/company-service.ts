import { ICrudService, RequestIdDto, ServiceUpdateOverwrite } from '@ear/common';
import { NotFoundError } from '@ear/core';
import { addressService } from '@ear/modules/address';
import { EntityManager, FindManyOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { Company, CompanyEntity } from './company-entity';
import { CreateCompanyDto, ListCompanyDto, UpdateCompanyDto } from './dtos';

/**
 * Retrieves and modifies Companies.
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
   * @param createDto contains data to create resource
   * @param entityManager used for transactions
   * @returns resource ID
   */
  async create(createDto: CreateCompanyDto, entityManager?: EntityManager): Promise<string> {
    return ICrudService.transaction(async (manager) => {
      const { address, ...companyInfo } = createDto;
      const addressId = await addressService.create(address, manager);
      const result = await manager.insert(CompanyEntity, {
        id: await this.generateId(),
        addressId,
        ...companyInfo,
      });
      return result.identifiers[0].id;
    }, entityManager);
  }

  /**
   * Returns a Company.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Company or undefined if not found
   */
  async get(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Company | undefined> {
    const manager = entityManager ?? getManager();
    return manager.findOne(
      CompanyEntity,
      { id: idDto.id },
      { relations: ['address'] },
    );
  }

  /**
   * Returns a Company or fail.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   * @returns Company
   */
  async getOrFail(idDto: RequestIdDto, entityManager?: EntityManager): Promise<Company> {
    const manager = entityManager ?? getManager();
    const result = await this.get(idDto, manager);
    if (typeof result === 'undefined') {
      throw new NotFoundError(`Cannot retrieve Company. ID ${idDto.id} does not exist.`);
    }
    return result;
  }

  /**
   * Update a Company.
   * @param updateDto contains data to update resource
   * @param entityManager used for transactions
   */
  async update(
    updateDto: ServiceUpdateOverwrite<Company, UpdateCompanyDto>,
    entityManager?: EntityManager,
  ): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const { id, address, ...updates } = updateDto;
      const result = await manager.update(CompanyEntity, { id }, updates);
      if (result.raw.affectedRows === 0) {
        throw new NotFoundError(`Cannot update Company. ID ${id} does not exist.`);
      }

      if (address) {
        const company = await this.getOrFail({ id });
        await addressService.update(
          {
            ...address,
            id: company.addressId,
          },
          manager,
        );
      }
    }, entityManager);
  }

  /**
   * Delete a Company.
   * @param idDto contains resource ID
   * @param entityManager used for transactions
   */
  async delete(idDto: RequestIdDto, entityManager?: EntityManager): Promise<void> {
    return ICrudService.transaction(async (manager) => {
      const company = await this.getOrFail(idDto, manager);
      const result = await manager.delete(CompanyEntity, { id: idDto.id });
      if (result.raw.affectedRows === 0) {
        throw new NotFoundError(`Cannot delete Company. ID ${idDto.id} does not exist.`);
      }
      await addressService.delete({ id: company.addressId }, manager);
    }, entityManager);
  }

  /**
   * List Companies.
   * @param listDto contains filters and list options
   * @param entityManager used for transactions
   * @returns Companies
   */
  async list(
    listDto?: ListCompanyDto,
    entityManager?: EntityManager,
  ): Promise<Company[]> {
    const manager = entityManager ?? getManager();
    const findManyOptions: FindManyOptions<Company> = {
      relations: ['address'],
    };

    if (listDto) {
      const { options, ...filters } = listDto;

      // filters
      findManyOptions.where = (qb: SelectQueryBuilder<Company>) => {
        this.buildListWhereClause(qb, 'Company', filters);
      };

      // pagination
      if (typeof options?.limit !== 'undefined') {
        findManyOptions.take = options?.limit;
        if (typeof options?.page !== 'undefined') {
          findManyOptions.skip = (options?.page - 1) * options?.limit;
        }
      }
    }

    return manager.find(CompanyEntity, findManyOptions);
  }
}

/**
 * Instance of CompanyService.
 */
export const companyService = new CompanyService();
