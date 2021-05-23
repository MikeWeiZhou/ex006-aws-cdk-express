import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { IDto } from '../common/dtos/i-dto';
import { IErrorParameters } from '../core/types/i-error-parameters';

/**
 * Data Transfer Object (DTO) utility functions.
 *
 * Features:
 *  - convert a DTO-like object (same shape) to a DTO (has validation and sanitization rules)
 *  - convert a DTO to a sanitized plain object
 *  - validates a DTO
 */
export class DtoUtility {
  /**
   * Returns a sanitized DTO from another object with same shape.
   *
   * For example:
   *    DTO specification:
   *      {
   *        @Expose() id;
   *        @Expose() name;
   *      }
   *
   *    DTO-like object with same shape:
   *      {
   *        "id": "abcd",
   *        "name": "Mushrein",
   *        "extra": "this field should be removed"
   *      }
   *
   *    Converted DTO instance:
   *      {
   *        id: 'abcd',
   *        name: 'Mushrein'
   *      }
   *
   * @param dtoConstructor class constructor of target DTO
   * @param dtoLikes DTO-like object(s) with same shape
   * @returns DTO instance(s)
   */
  sanitizeToDto<Dto extends IDto>(dtoConstructor: ClassConstructor<Dto>, dtoLikes: Dto): Dto;
  sanitizeToDto<Dto extends IDto>(dtoConstructor: ClassConstructor<Dto>, dtoLikes: Dto[]): Dto[];
  sanitizeToDto<Dto extends IDto>(dtoConstructor: ClassConstructor<Dto>, dtoLikes: any): any {
    if (Array.isArray(dtoLikes)) {
      return dtoLikes.map((dtoLike: Dto) => this.executeSanitizeToDto(dtoConstructor, dtoLike));
    }
    return this.executeSanitizeToDto(dtoConstructor, dtoLikes) as Dto;
  }

  /**
   * Returns a sanitized DTO-like object.
   *
   * For example:
   *    DTO instance:
   *      {
   *        @Expose()  id: 'abcd',
   *        @Expose()  name: 'Mushrein',
   *        @Exclude() secret: 'should never be shown to client'
   *      }
   *
   *    Converted DTO-like object:
   *      {
   *        "id": "abcd",
   *        "name": "Mushrein"
   *      }
   *
   * @param dtoInstances DTO instance(s)
   * @returns DTO-like object(s) with same shape
   */
  sanitizeFromDto<Dto extends IDto>(dtoInstances: Dto): Dto;
  sanitizeFromDto<Dto extends IDto>(dtoInstances: Dto[]): Dto[];
  sanitizeFromDto<Dto extends IDto>(dtoInstances: any): any {
    if (Array.isArray(dtoInstances)) {
      return dtoInstances.map((dto: Dto) => this.executeSanitizeFromDto(dto));
    }
    return this.executeSanitizeFromDto(dtoInstances) as Dto;
  }

  /**
   * Validates DTO and returns errors, if any.
   * @param dtoInstance DTO instance
   * @returns validations errors or undefined
   */
  async validateDto<Dto extends IDto>(dtoInstance: Dto): Promise<IErrorParameters | undefined> {
    const validationErrors = await validate(dtoInstance);
    if (validationErrors.length > 0) {
      return this.flattenValidationErrors(validationErrors);
    }
    return undefined;
  }

  /**
   * Returns a sanitized DTO-like object.
   * @param dtoInstance DTO instance
   * @returns DTO-like object with same shape
   */
  private executeSanitizeFromDto<Dto extends IDto>(dtoInstance: Dto): Dto {
    return classToPlain(
      dtoInstance,
      {
        // will strip out DTO properties explicitly defined with @Exclude()
        strategy: 'excludeAll',
      },
    ) as Dto;
  }

  /**
   * Returns a sanitized DTO from another object with same shape.
   * @param dtoConstructor class constructor of target DTO
   * @param dtoLike a DTO-like object with same shape
   * @returns DTO instance
   */
  private executeSanitizeToDto<Dto extends IDto>(
    dtoConstructor: ClassConstructor<Dto>,
    dtoLike: Dto,
  ): Dto {
    const dto = plainToClass(
      dtoConstructor,
      dtoLike,
      {
        // only use DTO properties explicitly defined with @Expose()
        strategy: 'excludeAll',
      },
    );
    this.deepDeleteUndefinedKeys(dto);
    return dto;
  }

  /**
   * Deep deletes undefined properties from the object.
   * @param obj object to have undefined properties removed
   */
  private deepDeleteUndefinedKeys(obj: any): void {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        this.deepDeleteUndefinedKeys(value);
        // delete empty object
        if (Object.keys(value).length === 0) {
          delete obj[key]; // eslint-disable-line no-param-reassign
        }
      } else if (typeof value === 'undefined') {
        // delete undefined
        delete obj[key]; // eslint-disable-line no-param-reassign
      }
    });
  }

  /**
   * Flatten nested ValidationErrors into IErrorParameters.
   * @param validationErrors validation errors from class-validator
   * @param paramPrefix prefix for parameter name (used for nested validation)
   * @returns flat IErrorParameters oject
   */
  private flattenValidationErrors(
    validationErrors: ValidationError[],
    paramPrefix?: string,
  ): IErrorParameters {
    let params: IErrorParameters = {};
    validationErrors.forEach((validationError) => {
      const { property, constraints, children } = validationError;
      const paramName = (paramPrefix)
        ? `${paramPrefix}${property}`
        : property;
      if (constraints) {
        // use first constraint error only
        [params[paramName]] = Object.values(constraints);
      } else if (children) {
        const childParams = this.flattenValidationErrors(children, `${paramName}.`);
        params = {
          ...params,
          ...childParams,
        };
      } else {
        params[paramName] = 'invalid or missing parameter';
      }
    });
    return params;
  }
}

/**
 * Instance of DtoUtility.
 */
export const dtoUtility = new DtoUtility();
