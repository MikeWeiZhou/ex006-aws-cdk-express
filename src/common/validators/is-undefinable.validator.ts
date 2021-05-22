import { ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Ignores all other validators if value is undefined.
 */
export function IsUndefinable(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj: any, value: any) => value !== undefined);
}
