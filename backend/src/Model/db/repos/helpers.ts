// Default value which can be used with pg-promise. It will transform into "DEFAULT" for Postgresql.
export const DEFAULT = {
  rawType: true,
  toPostgres: (): string => 'default',
};
