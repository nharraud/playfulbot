import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '~playfulbot/(.*)': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['__tests__/helpers/', '__tests__/fixtures/'],
  setupFiles: ['dotenv-flow/config'],
  testRunner: 'jest-circus/runner',
};
export default config;
