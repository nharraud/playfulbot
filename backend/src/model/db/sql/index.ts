import pgPromise, { QueryFile } from 'pg-promise';
import { join } from 'path';

function sqlFile(file: string) {
  const fullPath = join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

export default {
  init: sqlFile('db_init.sql'),
};
