import { registerDecorator, ValidationArguments } from 'class-validator';

/**
 * Checks if number is a currency amount.
 *
 * Can only be zero or positive integer up to 999,999,99.
 */
export function IsCurrencyAmount(max: number = 99999999) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyCode',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be 0 or a positive integer up to 99 999 999`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Number.isInteger(value)
            && value >= 0
            && value <= max;
        },
      },
    });
  };
}
