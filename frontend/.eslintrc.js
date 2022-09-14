module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
  rules: {
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', "always", { 'exceptAfterSingleLine': true }],
    'max-classes-per-file': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'prettier/prettier': ['error'],
  },
};
