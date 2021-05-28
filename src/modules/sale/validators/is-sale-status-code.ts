import { registerDecorator, ValidationArguments } from 'class-validator';
import { SaleStatusCode } from '../types/sale-status-code';

/**
 * Checks if string is a SaleStatusCode.
 */
export function IsSaleStatusCode() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSaleStatusCode',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} is not a valid SaleStatusCode`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string'
            && Object.values(SaleStatusCode).includes(value as SaleStatusCode);
        },
      },
    });
  };
}
