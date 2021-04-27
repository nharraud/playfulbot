import { GraphQLScalarType, Kind } from 'graphql';
import { DateTime } from 'luxon';

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: DateTime) {
    return value.toISO();
  },
  parseValue(value: string) {
    return DateTime.fromISO(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value);
    }
    throw new Error('Invalid Date');
  },
});
