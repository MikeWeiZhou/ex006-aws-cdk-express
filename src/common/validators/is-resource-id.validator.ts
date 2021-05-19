import { registerDecorator, ValidationArguments } from 'class-validator';
import constantsConfig from '../../config/constants.config';

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
          return typeof value === 'string' && value.length === constantsConfig.RESOURCE_ID_TOTAL_LENGTH;
        },
      },
    });
  };
}
