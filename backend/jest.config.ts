import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '~playfulbot/(.*)': '<rootDir>/src/$1',
  },
  setupFiles: ['dotenv-flow/config'],
  testRunner: 'jest-circus/runner',
};
export default config;
