/* eslint-disable prefer-template */
import { IBaseProtocol } from 'pg-promise';
import { DatabaseError as PGDatabaseError } from 'pg-protocol/dist/messages';

// Default value which can be used with pg-promise. It will transform into "DEFAULT" for Postgresql.
export const DEFAULT = {
  rawType: true,
  toPostgres: (): string => 'default',
};

export type DbOrTx = IBaseProtocol<unknown>;

export class QueryBuilder {
  private readonly startQuery;
  private readonly filters = new Array<string>();
  private readonly joins = new Array<string>();
  private order: string = undefined;
  private _limit: string = undefined;

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

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.order = ` ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(key: string): this {
    this._limit = ` LIMIT $[${key}]`;
    return this;
  }

  get query(): string {
    let result = this.startQuery;

    for (const join of this.joins) {
      result += ' ' + join;
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
    if (this.order) {
      result += this.order;
    }
    if (this._limit) {
      result += this._limit;
    }
    return result;
  }
}

export function isDatabaseError(obj: any): obj is PGDatabaseError {
  return obj instanceof PGDatabaseError;
}

export type DatabaseError = PGDatabaseError;
