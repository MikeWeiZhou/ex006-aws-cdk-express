import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { IDto } from '../common/dtos/i.dto';

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
   * @param dtoLike a DTO-like object with same shape
   * @returns DTO instance
   */
  sanitizeToDto(dtoConstructor: ClassConstructor<IDto>, dtoLike: IDto): IDto {
    const dto: any = plainToClass(
      dtoConstructor,
      dtoLike,
      {
        // only use DTO properties explicitly defined with @Expose()
        strategy: 'excludeAll',
      },
    );
    // strip out undefined properties
    Object.entries(dto).forEach(([key, value]) => {
      if (typeof value === 'undefined') {
        delete dto[key];
      }
    });
    return dto;
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
   * @param dtoInstance DTO instance
   * @returns DTO-like object with same shape
   */
  sanitizeFromDto(dtoInstance: IDto) {
    return classToPlain(
      dtoInstance,
      {
        // will strip out DTO properties explicitly defined with @Exclude()
        strategy: 'excludeAll',
      },
    );
  }

  /**
   * Validates DTO and returns errors, if any.
   * @param dtoInstance DTO instance
   * @returns validations errors, if any
   */
  async validateDto(dtoInstance: IDto): Promise<ValidationError[]> {
    return validate(dtoInstance);
  }
}

export default new DtoUtility();
