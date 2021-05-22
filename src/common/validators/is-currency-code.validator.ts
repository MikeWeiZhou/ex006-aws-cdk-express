import { Currency } from '@ear/common/enums';
import { registerDecorator, ValidationArguments } from 'class-validator';

/**
 * Checks if string is a supported currency code.
 */
export function IsCurrencyCode() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyCode',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be one of the supported currency`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string'
            && Object.values(Currency).includes(value as Currency);
        },
      },
    });
  };
}
