import { GraphQLScalarType, Kind } from 'graphql';
import { isString } from '~playfulbot-commons/utils/types';

const isoRegEx = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

function isValidIsoDate(str: string) {
  return Boolean(isoRegEx.test(str));
}

export const DateScalar = new GraphQLScalarType<Date, string>({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    } else 
    if (isString(value)) {
      return value.toString();
    }
    throw new Error(`Unexpected type ${typeof value}`);
  },
  parseValue(value) {
    if (typeof value === 'string') {
      if (!isValidIsoDate(value)) 
        throw new Error(`Invalid ISO date ${value}`);{
      }
      return new Date(value);
    }
    throw new Error(`Unexpected type ${typeof value}`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('Invalid Date');
  },
});
