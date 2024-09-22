import { ValidationError } from "~playfulbot/core/use-cases/Errors";
import * as yup from 'yup';

function convertYupErrorToValidationError(yupError: yup.ValidationError, msg: string): ValidationError {
  const formattedErrors: Record<string, Array<string>> = {};
  const yupErrors = [yupError];
  let processedError;
  while (processedError = yupErrors.pop()) {
    if (processedError.inner && processedError.inner.length) {
      yupErrors.push(...processedError.inner);
    }

    if (!processedError.path) {
      continue;
    }

    let pathErrors = formattedErrors[processedError.path];
    if (!pathErrors) {
        pathErrors = [];
        formattedErrors[processedError.path] = pathErrors;
    }
    pathErrors.push(...processedError.errors);
  }
  return new ValidationError(msg, formattedErrors);
}

export async function validateSchema<SCHEMA extends yup.ObjectSchema<any>, DATA>(
  schema: SCHEMA,
  data: DATA,
  msg: string
): Promise<ValidationError | null> {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return convertYupErrorToValidationError(err, msg);
    }
    throw err;
  }
  return null;
}
