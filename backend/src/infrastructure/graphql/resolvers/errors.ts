import { ForbiddenError, ValidationError } from "~playfulbot/core/use-cases/Errors";
import { TeamNameAlreadyTakenError } from "~playfulbot/core/use-cases/interfaces/TeamProvider";

type UseCaseError = ValidationError | ForbiddenError | TeamNameAlreadyTakenError;

export function toGraphQLError<GenError extends UseCaseError>(error: GenError) {
  return {
    // We cast the type to force TS to narrow `__typename` possible values to the real provided error
    __typename: error.name as GenError['name'],
    message: error.message,
  }
}
