import { IBaseProtocol } from 'pg-promise';

// Default value which can be used with pg-promise. It will transform into "DEFAULT" for Postgresql.
export const DEFAULT = {
  rawType: true,
  toPostgres: (): string => 'default',
};

export type DbOrTx = IBaseProtocol<unknown>;
