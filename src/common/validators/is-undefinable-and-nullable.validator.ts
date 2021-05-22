import { ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Ignores all other validators if value is undefined or null.
 */
export function IsUndefinableAndNullable(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj: any, value: any) => value !== undefined && value !== null);
}
