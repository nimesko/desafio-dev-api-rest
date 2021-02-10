import { PropertyValidatorError } from '@marcj/marshal';

export function NumberGreaterThanZero(
  value: number,
): void | PropertyValidatorError {
  if (value < 0) {
    return new PropertyValidatorError(
      'greater_zero',
      `Value must be greater than 0`,
    );
  }
}
