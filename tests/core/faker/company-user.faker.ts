import { companyService } from '@ear/modules/company';
import { CompanyUserDto, CreateCompanyUserDto } from '@ear/modules/company-user';
import { request } from '../request';
import { company } from './company.faker';
import { IFaker } from './i.faker';
import { user } from './user.faker';

export class CompanyUserFaker extends IFaker<CreateCompanyUserDto, CompanyUserDto> {
  /**
   * Constructor.
   */
  constructor() {
    super('/company-users');
  }

  /**
   * Returns DTO used for creating a CompanyUser.
   * @param dto uses any provided properties over generated ones
   * @param noDatabaseWrites do not create dependency entities in database, defaults to false
   * @returns DTO
   */
  async dto(
    dto?: Partial<CreateCompanyUserDto>,
    noDatabaseWrites: boolean = false,
  ): Promise<CreateCompanyUserDto> {
    const companyId = dto?.companyId
      || ((noDatabaseWrites && await companyService.generateId())
      || (await company.create()).id);
    const userDto = dto?.user ?? await user.dto();
    return {
      companyId,
      user: userDto,
    };
  }

  /**
   * Creates a Customer on test API server.
   * @param dto uses any provided properties over generated ones
   * @returns a model-like DTO
   */
  async create(dto?: Partial<CreateCompanyUserDto>): Promise<CompanyUserDto> {
    const createDto = await this.dto(dto);
    const create = await request.post(this.rootPath).send(createDto);
    this.addToGarbageBin(create.body);
    return create.body;
  }

  /**
   * @override
   * All resources in garbage bin will be deleted from the server.
   */
  async cleanGarbage(): Promise<void> {
    await super.cleanGarbage();
    await company.cleanGarbage();
  }
}

export const companyUser = new CompanyUserFaker();
