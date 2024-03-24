/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  verbose: true,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '~playfulbot/(.*)': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['__tests__/helpers/', '__tests__/fixtures/'],
  setupFiles: ['dotenv-flow/config'],

  transformIgnorePatterns: ['<rootDir>/node_modules/(?!uuid)'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: {
          allowJs: true,
        },
      },
    ],
  },
};
