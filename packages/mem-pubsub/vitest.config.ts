import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '~mem-pubsub/': new URL('./src/', import.meta.url).pathname,
    }
  },
})
