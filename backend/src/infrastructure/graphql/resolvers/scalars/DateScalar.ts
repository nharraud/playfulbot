import { GraphQLScalarType, Kind } from 'graphql';
import { DateTime } from 'luxon';
import { isString } from '~playfulbot/utils/types';

export const DateScalar = new GraphQLScalarType<DateTime, string>({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof DateTime) {
      return value.toISO();
    } else 
    if (isString(value)) {
      return value.toString();
    }
    throw new Error(`Unexpected type ${typeof value}`);
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return DateTime.fromISO(value);
    }
    throw new Error(`Unexpected type ${typeof value}`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value);
    }
    throw new Error('Invalid Date');
  },
});
