import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    include: ['tests/client/**/*.test.{js,jsx}'],
    setupFiles: ['tests/client/setup.js'],
    css: false,
  },
});
