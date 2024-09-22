import { DatabaseError, isDatabaseError } from 'playfulbot-backend-commons/lib/model/db/helpers';
import { InvalidArgument, UnkownError } from '~playfulbot/core/use-cases/Errors';


export function convertDatabaseError(error: DatabaseError) {
  if (error.code === '22P02') {
    return new InvalidArgument(null, { cause: error });
  }
  return new UnkownError(null, { cause: error });
}

export function convertError(error: Error) {
  if (isDatabaseError(error)) {
    return convertDatabaseError(error);
  }
  return error;
}
