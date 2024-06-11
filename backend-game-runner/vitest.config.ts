import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        // See https://github.com/graphql/graphql-js/issues/2801#issuecomment-1758428498
        fallbackCJS: true,
      },
    },
    globals: true,
    alias: {
      '~game-runner/': new URL('./src/', import.meta.url).pathname,
      // See https://github.com/vitejs/vite/issues/7879
      // https://github.com/graphql/graphql-js/issues/2801#issuecomment-1846206543
      'graphql': 'graphql/index.js',
    },
    setupFiles: 'dotenv-flow/config',
    exclude:[
      ...configDefaults.exclude, 
      'build/**'
    ]
  },
})
