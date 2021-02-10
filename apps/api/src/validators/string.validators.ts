import { PropertyValidatorError } from '@marcj/marshal';

export function StringMaxLength(length: number) {
  return (value: string) => {
    if (value.length > length) {
      return new PropertyValidatorError(
        'too_long',
        `Property has more than ${length} characters`,
      );
    }
  };
}

export function StringMinMaxLength(minLength: number, maxLength: number) {
  return (value: string) => {
    if (value.length > maxLength) {
      return new PropertyValidatorError(
        'too_long',
        `Property has more than ${maxLength} character(s)`,
      );
    }
    if (value.length < minLength) {
      return new PropertyValidatorError(
        'too_short',
        `Property has less than ${minLength} character(s)`,
      );
    }
  };
}
