import { types } from 'pg';
import { DateTime, Settings } from 'luxon';

Settings.defaultZoneName = 'UTC';

// See https://github.com/brianc/node-postgres/issues/429#issuecomment-24870258
export function fixTimeParsing(): void {
  types.setTypeParser(1083, (stringValue) => DateTime.fromISO(stringValue));
  types.setTypeParser(1266, (stringValue) => DateTime.fromISO(stringValue));
  types.setTypeParser(1114, (stringValue) => DateTime.fromISO(stringValue.replace(' ', 'T')));
  types.setTypeParser(1184, (stringValue) => DateTime.fromISO(stringValue.replace(' ', 'T')));
}
