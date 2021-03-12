/* eslint import/first: "off" */

import dotenv from 'dotenv-flow';

dotenv.config();

import { execute } from '~playfulbot/cli';

execute(process.argv).catch((error: Error) => {
  console.log(JSON.stringify(error, null, 2));
  console.log(error.stack);
});
