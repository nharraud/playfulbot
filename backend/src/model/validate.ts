import * as yup from 'yup';
import { ValidationError as GraphQLValidationError } from '../types/graphql-generated';

export interface ValidationError {
  validationErrors: string[];
}

export async function validateSchema<SCHEMA extends yup.ObjectSchema<any>, DATA>(
  schema: SCHEMA,
  data: DATA
): Promise<ValidationError | null> {
  try {
    await schema.validate(data);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach(e => e.path)
      return { validationErrors: err.errors };
    }
    throw err;
  }
  return null;
}

export function validationErrorsToGraphQL(
  validationError: ValidationError
): GraphQLValidationError[] {
  return validationError.validationErrors.map((error) => ({
    __typename: 'ValidationError',
    message: error,
  }));
}

// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export function isValidationError(obj: any): obj is ValidationError {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   return obj?.validationErrors !== undefined;
// }
