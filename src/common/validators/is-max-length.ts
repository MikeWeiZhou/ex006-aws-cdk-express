import { registerDecorator, ValidationArguments } from 'class-validator';

/**
 * Checks if string has length between 1 and max, inclusive min and max.
 */
export function IsMaxLength(max: number) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMaxLength',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a string with length inclusive between 1 and ${max}`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string'
            && value.length >= 1
            && value.length <= max;
        },
      },
    });
  };
}
