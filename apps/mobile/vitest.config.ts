import { defineConfig } from 'vitest/config';

// Scoped to framework-agnostic logic (e.g. the bingo engine). React Native /
// Expo component tests are out of scope here — those need jest-expo.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'constants/**/*.test.ts'],
  },
});
