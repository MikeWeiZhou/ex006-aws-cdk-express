import { registerDecorator, ValidationArguments } from 'class-validator';
import constants from '../../config/constants';

/**
 * Checks if value is a resource ID.
 */
export function IsResourceId() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isResourceId',
      target: object.constructor,
      propertyName,
      // constraints: [property],
      // options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value.length === constants.RESOURCE_ID_TOTAL_LENGTH;
        },
      },
    });
  };
}
