export enum VALIDATION_ERROR_CODE {
  ALREADY_TAKEN = 'ALREADY_TAKEN',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  INVALID_TYPE = 'INVALID_TYPE',
};

export type ValidationErrorData = { error: VALIDATION_ERROR_CODE, expected?: string };

export function expectString(value: any, { min, max }: { min?: number, max?: number }): ValidationErrorData {
  if (!(value instanceof String) && typeof value !== 'string') {
    return { error: VALIDATION_ERROR_CODE.INVALID_TYPE, expected: 'STRING' };
  }
  if (value.length < min) {
    return { error: VALIDATION_ERROR_CODE.TOO_SHORT, expected: `> ${min}` }
  }
  if (value.length > max) {
    return { error: VALIDATION_ERROR_CODE.TOO_LONG, expected: `< ${max}` }
  }
}
