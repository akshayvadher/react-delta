import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./src/**/*.test.tsx'],
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
