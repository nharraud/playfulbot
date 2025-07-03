export function toGraphQLError<GenError extends { name: string, message: string }>(error: GenError) {
  return {
    // We cast the type to force TS to narrow `__typename` possible values to the real provided error
    __typename: error.name as GenError['name'],
    message: error.message,
  }
}
