import { constants } from '@ear/config';
import { registerDecorator, ValidationArguments } from 'class-validator';

/**
 * Checks if string is a resource ID.
 */
export function IsResourceId() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isResourceId',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} is not a valid resource ID`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value.length === constants.RESOURCE_ID_TOTAL_LENGTH;
        },
      },
    });
  };
}
