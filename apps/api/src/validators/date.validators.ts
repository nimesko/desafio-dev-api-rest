import { PropertyValidatorError } from '@marcj/marshal';

const REGEX_ISO_8601 = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

export function DateISO8601(value: string): void | PropertyValidatorError {
  if (!REGEX_ISO_8601.test(value)) {
    return new PropertyValidatorError(
      'date_iso8601',
      `Provided date is not a valid ISO 8601 Date`,
    );
  }
}
