/* eslint-disable prefer-template */
import { IBaseProtocol } from 'pg-promise';
import { DatabaseError as PGDatabaseError } from 'pg-protocol/dist/messages';

// Default value which can be used with pg-promise. It will transform into "DEFAULT" for Postgresql.
export const DEFAULT = {
  rawType: true,
  toPostgres: (): string => 'default',
};

export type DbOrTx = IBaseProtocol<unknown>;


export function sanitizeValueFromValueSet<T>(value: T, allowedValues: T[], defaultValue: T): T {
  if (!allowedValues.includes(value)) {
    return defaultValue;
  }
  return value;
}

export function sanitizeNumber(value: any, { min = 0, max }: { min?: number, max?: number }, defaultValue: number): number {
  if (
      (!(value instanceof Number) && typeof value !== 'number') ||
      value.valueOf() < (min || 0) || value.valueOf() > max
    ) {
    return defaultValue
  }
  return value.valueOf() as number;
}

export class QueryBuilder {
  private readonly startQuery;
  private readonly filters = new Array<string>();
  private readonly joins = new Array<string>();
  private _order: string = undefined;
  private _limit: string = undefined;
  private _offset: string = undefined;

  constructor(query: string) {
    this.startQuery = query;
  }

  join(join: string): this {
    this.joins.push(join);
    return this;
  }

  where(filter: string): this {
    this.filters.push(filter);
    return this;
  }

  orderBy(
    { column, allowed, defaultColumn, direction = 'ASC' }:
      { column: string, allowed?: string[], defaultColumn?: string, direction: 'ASC' | 'DESC' }
  ): this {
    direction = sanitizeValueFromValueSet(direction, ['ASC', 'DESC'], 'ASC');
    if (allowed) {
      column = sanitizeValueFromValueSet(column, allowed, defaultColumn);
    }

    this._order = ` ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(
    { limit, max, defaultLimit }:
      { limit: number, max: number, defaultLimit: number }
  ): this {
    limit = sanitizeNumber(limit, { max }, defaultLimit);
    this._limit = ` LIMIT ${limit}`;
    return this;
  }

  offset(offset: number): this {
    offset = sanitizeNumber(offset, { max: 100000 }, 0);
    this._offset = ` OFFSET ${offset}`;
    return this;
  }

  get query(): string {
    let result = this.startQuery;

    for (const join of this.joins) {
      result += ' JOIN ' + join;
    }

    let firstFilter = true;
    for (const filter of this.filters) {
      if (firstFilter) {
        result += ` WHERE ${filter}`;
        firstFilter = false;
      } else {
        result += ` AND ${filter}`;
      }
    }
    if (this._order) {
      result += this._order;
    }
    if (this._limit) {
      result += this._limit;
    }
    if (this._offset) {
      result += this._offset;
    }
    return result;
  }
}

export function isDatabaseError(obj: any): obj is PGDatabaseError {
  return obj instanceof PGDatabaseError;
}

export type DatabaseError = PGDatabaseError;

export function bigIntToNumber(value: BigInt): number {
  // @ts-ignore
  if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
    throw new Error(`Can\'t convert ${value} to Number`);
  }
  return parseInt(value as any);
}
